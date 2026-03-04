import { ChangeDetectionStrategy, Component, computed, input, output, signal, OnDestroy } from '@angular/core';
import { Pet, PET_SPECIES_OPTIONS } from '../../../models/pet.model';

@Component({
  selector: 'app-pet-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      [class]="cardClass()"
      role="listitem"
    >
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
        <span class="block truncate font-medium" [class]="displayMode() ? 'text-lg text-slate-800' : 'text-slate-800'">{{ pet().name }}</span>
        <div class="flex items-center gap-2 text-xs" [class]="displayMode() ? 'text-sm text-slate-500' : 'text-slate-400'">
          <span class="truncate">{{ pet().ownerName }}</span>
          @if (pet().status !== 'done') {
            <span aria-hidden="true">&middot;</span>
            <time [attr.datetime]="pet().statusChangedAt" aria-label="Waiting time">{{ waitTime() }}</time>
          }
        </div>
      </div>

      <!-- In readonly mode (display window), hide all action buttons -->
      @if (!readonly()) {
        @if (pet().status === 'done') {
          <button
            type="button"
            class="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
            [attr.aria-label]="'Dismiss ' + pet().name + ' from queue'"
            (click)="remove.emit(pet().id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        } @else {
          <button
            type="button"
            class="rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40"
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
  `,
})
export class PetCardComponent implements OnDestroy {
  readonly pet = input.required<Pet>();
  readonly position = input<number | null>(null);
  readonly actionDisabled = input(false);
  /** When true, hides all action buttons (used in display-only mode for customers). */
  readonly readonly = input(false);
  /** When true, renders a larger card for customer-facing display screens. */
  readonly displayMode = input(false);

  readonly action = output<string>();
  readonly remove = output<string>();

  private readonly speciesMap = new Map(PET_SPECIES_OPTIONS.map((o) => [o.value, o.icon]));

  private readonly now = signal(Date.now());
  private readonly timerRef = setInterval(() => this.now.set(Date.now()), 30_000);

  protected readonly speciesIcon = computed(() => this.speciesMap.get(this.pet().species) ?? '🐾');

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
      ? 'flex items-center gap-4 rounded-2xl px-5 py-4 shadow-md transition-colors'
      : 'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors';
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

  ngOnDestroy(): void {
    clearInterval(this.timerRef);
  }
}
