import { ChangeDetectionStrategy, Component, computed, input, output, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pet, PET_SPECIES_OPTIONS, VISIT_REASON_OPTIONS, PetSpecies, VisitReason } from '../../../models/pet.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pet-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [FormsModule, TitleCasePipe],
  template: `
    @if (editing()) {
      <!-- EDIT MODE: inline form replacing the entire card -->
      <div [class]="cardClass()" role="listitem">
        <div class="flex w-full flex-col gap-2.5">
          <!-- Row 1: name + owner inputs side by side -->
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="mb-0.5 block text-xs font-medium text-slate-500">Pet Name</label>
              <input
                type="text"
                class="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                [(ngModel)]="editName"
                (keydown.enter)="saveEdit()"
                (keydown.escape)="cancelEdit()"
              />
            </div>
            <div class="flex-1">
              <label class="mb-0.5 block text-xs font-medium text-slate-500">Owner</label>
              <input
                type="text"
                class="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                [(ngModel)]="editOwner"
                (keydown.enter)="saveEdit()"
                (keydown.escape)="cancelEdit()"
              />
            </div>
          </div>
          <!-- Row 2: species + visit reason selects -->
          <div class="flex gap-2">
            <div>
              <label class="mb-0.5 block text-xs font-medium text-slate-500">Species</label>
              <select
                class="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                [(ngModel)]="editSpecies"
              >
                @for (opt of speciesOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.icon }} {{ opt.label }}</option>
                }
              </select>
            </div>
            <div>
              <label class="mb-0.5 block text-xs font-medium text-slate-500">Reason</label>
              <select
                class="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                [(ngModel)]="editVisitReason"
              >
                @for (opt of visitReasonOptions; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>
          <!-- Row 3: notes + save/cancel -->
          <div class="flex items-end gap-2">
            <div class="flex-1">
              <label class="mb-0.5 block text-xs font-medium text-slate-500">Notes</label>
              <input
                type="text"
                class="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                [(ngModel)]="editNotes"
                placeholder="Optional"
                (keydown.enter)="saveEdit()"
                (keydown.escape)="cancelEdit()"
              />
            </div>
            <div class="ml-auto flex gap-1.5">
              <button
                type="button"
                class="cursor-pointer rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-40 active:scale-95"
                [disabled]="!editName.trim() || !editOwner.trim()"
                (click)="saveEdit()"
              >Save</button>
              <button
                type="button"
                class="cursor-pointer rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 active:scale-95"
                (click)="cancelEdit()"
              >Cancel</button>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <!-- NORMAL MODE -->
      <div [class]="cardClass()" role="listitem">
        @if (position()) {
          <span
            class="flex shrink-0 items-center justify-center rounded-full bg-blue-200 font-bold text-blue-700"
            [class]="displayMode() ? 'h-8 w-8 text-sm bg-blue-100 text-blue-700' : 'h-6 w-6 text-xs'"
            aria-label="Queue position {{ position() }}"
          >
            {{ position() }}
          </span>
        }

        <span class="text-lg" [class.text-2xl]="displayMode()" [attr.aria-label]="pet().species" role="img">{{ speciesIcon() }}</span>

        <div class="flex-1 min-w-0">
          <span class="block truncate font-medium" [class]="displayMode() ? 'text-lg text-slate-800' : 'text-slate-800'">{{ pet().name | titlecase }}</span>
          <div class="flex items-center gap-2 text-xs" [class]="displayMode() ? 'text-sm text-slate-500' : 'text-slate-400'">
            <span class="truncate">{{ pet().ownerName | titlecase }} </span>
            @if (pet().status !== 'done') {
              <span aria-hidden="true">&middot;</span>
              <time [attr.datetime]="pet().statusChangedAt" aria-label="Waiting time">{{ waitTime() }}</time>
            }
          </div>
          @if (reasonLabel()) {
            <span class="mt-1 inline-block rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700" [class.text-sm]="displayMode()">{{ reasonLabel() | titlecase }}</span>
          }
          @if (pet().notes) {
            <p class="mt-0.5 truncate text-xs italic text-slate-400" [class.text-sm]="displayMode()">{{ pet().notes | titlecase }}</p>
          }
        </div>

        @if (!readonly()) {
          <!-- Edit button -->
          <button
            type="button"
            class="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 active:scale-95"
            [attr.aria-label]="'Edit ' + pet().name"
            (click)="startEdit()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          <!-- Action / Dismiss button -->
          @if (pet().status === 'done') {
            <button
              type="button"
              class="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 active:scale-95"
              [attr.aria-label]="'Dismiss ' + pet().name + ' from queue'"
              (click)="remove.emit(pet().id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          } @else {
            <button
              type="button"
              class="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              [class]="actionBtnClass()"
              [disabled]="actionDisabled()"
              [attr.aria-label]="actionLabel()"
              (click)="action.emit(pet().id)"
            >
              {{ pet().status === 'listed' ? 'Next' : 'Done' }}
            </button>
          }
        }
      </div>
    }
  `,
})
export class PetCardComponent implements OnDestroy {
  readonly pet = input.required<Pet>();
  readonly position = input<number | null>(null);
  readonly actionDisabled = input(false);
  readonly readonly = input(false);
  readonly displayMode = input(false);

  readonly action = output<string>();
  readonly remove = output<string>();
  readonly edit = output<{ id: string; name: string; ownerName: string; species: PetSpecies; visitReason: VisitReason; notes: string }>();

  protected readonly speciesOptions = PET_SPECIES_OPTIONS;
  protected readonly visitReasonOptions = VISIT_REASON_OPTIONS;

  private readonly speciesMap = new Map(PET_SPECIES_OPTIONS.map((o) => [o.value, o.icon]));

  private readonly now = signal(Date.now());
  private readonly timerRef = setInterval(() => this.now.set(Date.now()), 30_000);

  protected readonly speciesIcon = computed(() => this.speciesMap.get(this.pet().species) ?? '🐾');

  private readonly reasonMap = new Map(VISIT_REASON_OPTIONS.filter((o) => o.value).map((o) => [o.value, o.label]));
  protected readonly reasonLabel = computed(() => this.reasonMap.get(this.pet().visitReason) ?? '');

  protected readonly waitTime = computed(() => {
    const diffMs = this.now() - this.pet().statusChangedAt;
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  });

  protected readonly cardClass = computed(() => {
    const big = this.displayMode();
    const base = big
      ? 'flex items-center gap-4 rounded-2xl px-5 py-4 shadow-md transition-all'
      : 'flex items-center gap-3 rounded-xl px-4 py-3 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5';
    switch (this.pet().status) {
      case 'listed':
        return `${base} ${big ? 'bg-white border border-blue-200' : 'bg-blue-50'}`;
      case 'examining':
        return `${base} ${big ? 'bg-white border border-amber-200' : 'bg-amber-50'}`;
      case 'done':
        return `${base} ${big ? 'bg-white border border-emerald-200' : 'bg-emerald-50'}`;
    }
  });

  protected readonly actionBtnClass = computed(() => {
    if (this.pet().status === 'listed') {
      return 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400';
    }
    return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-400';
  });

  protected readonly actionLabel = computed(() => {
    const name = this.pet().name;
    if (this.actionDisabled()) return `Cannot move ${name} — examining is full`;
    return this.pet().status === 'listed'
      ? `Move ${name} to examining`
      : `Mark ${name} as done`;
  });

  // --- Edit mode ---
  protected readonly editing = signal(false);
  protected editName = '';
  protected editOwner = '';
  protected editSpecies: PetSpecies = 'dog';
  protected editVisitReason: VisitReason = '';
  protected editNotes = '';

  protected startEdit(): void {
    const p = this.pet();
    this.editName = p.name;
    this.editOwner = p.ownerName;
    this.editSpecies = p.species;
    this.editVisitReason = p.visitReason;
    this.editNotes = p.notes;
    this.editing.set(true);
  }

  protected saveEdit(): void {
    if (!this.editName.trim() || !this.editOwner.trim()) return;
    this.edit.emit({
      id: this.pet().id,
      name: this.editName.trim(),
      ownerName: this.editOwner.trim(),
      species: this.editSpecies,
      visitReason: this.editVisitReason,
      notes: this.editNotes.trim(),
    });
    this.editing.set(false);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerRef);
  }
}
