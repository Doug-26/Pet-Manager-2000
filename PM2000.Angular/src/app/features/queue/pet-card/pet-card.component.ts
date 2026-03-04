import { ChangeDetectionStrategy, Component, computed, input, output, signal, OnDestroy } from '@angular/core';
import { Pet } from '../../../models/pet.model';

@Component({
  selector: 'app-pet-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="cardClass()"
      role="listitem"
    >
      @if (position()) {
        <span
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-700"
          aria-label="Queue position {{ position() }}"
        >
          {{ position() }}
        </span>
      }

      <div class="flex-1 min-w-0">
        <span class="block truncate font-medium text-slate-800">{{ pet().name }}</span>
        <div class="flex items-center gap-2 text-xs text-slate-400">
          <span class="truncate">{{ pet().ownerName }}</span>
          @if (pet().status !== 'done') {
            <span aria-hidden="true">&middot;</span>
            <time [attr.datetime]="pet().statusChangedAt" aria-label="Waiting time">{{ waitTime() }}</time>
          }
        </div>
      </div>

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
          class="rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
          [class]="actionBtnClass()"
          [attr.aria-label]="actionLabel()"
          (click)="action.emit(pet().id)"
        >
          {{ pet().status === 'listed' ? 'Next' : 'Done' }}
        </button>
      }
    </div>
  `,
})
export class PetCardComponent implements OnDestroy {
  readonly pet = input.required<Pet>();
  readonly position = input<number | null>(null);

  readonly action = output<string>();
  readonly remove = output<string>();

  private readonly now = signal(Date.now());
  private readonly timerRef = setInterval(() => this.now.set(Date.now()), 30_000);

  protected readonly waitTime = computed(() => {
    const diffMs = this.now() - this.pet().statusChangedAt;
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  });

  protected readonly cardClass = computed(() => {
    const base = 'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors';
    switch (this.pet().status) {
      case 'listed':
        return `${base} bg-blue-50`;
      case 'examining':
        return `${base} bg-amber-50`;
      case 'done':
        return `${base} bg-emerald-50`;
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
    return this.pet().status === 'listed'
      ? `Move ${name} to examining`
      : `Mark ${name} as done`;
  });

  ngOnDestroy(): void {
    clearInterval(this.timerRef);
  }
}
