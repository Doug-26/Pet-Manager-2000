import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white/80 shadow-sm backdrop-blur-sm">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
        <span class="text-3xl" role="img" aria-label="Paw print">🐾</span>
        <div>
          <h1 class="text-xl font-bold leading-tight text-slate-800">Pet Manager 2000</h1>
          <p class="text-xs text-slate-500">Pet store queue management</p>
        </div>
        @if (totalPets() > 0) {
          <span
            class="ml-auto rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ totalPets() }} pet{{ totalPets() === 1 ? '' : 's' }} total
          </span>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly totalPets = input(0);
}
