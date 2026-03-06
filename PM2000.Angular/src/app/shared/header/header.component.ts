import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white/80 shadow-sm backdrop-blur-sm">
      <div class="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
        <span class="text-3xl" role="img" aria-label="Paw print" style="filter: sepia(1) saturate(3) hue-rotate(340deg) brightness(0.75)">🐾</span>
        <div>
          <h1 class="text-xl font-bold leading-tight text-slate-800">Pet Manager 2000</h1>
          <p class="text-xs text-slate-500">Pet store queue management</p>
        </div>
        <div class="ml-auto flex items-center gap-3">
          @if (totalPets() > 0) {
            <span
              class="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
              aria-live="polite"
              aria-atomic="true"
            >
              {{ totalPets() }} pet{{ totalPets() === 1 ? '' : 's' }} total
            </span>
          }
          @if (displayOpen()) {
            <button
              type="button"
              class="cursor-pointer flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 active:scale-95"
              aria-label="Close the customer display window"
              (click)="closeDisplay()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              Hide Display
            </button>
          } @else {
            <button
              type="button"
              class="cursor-pointer flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 active:scale-95"
              aria-label="Open queue display in a new window for customers"
              (click)="openDisplay()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
                <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v6h8V6z" clip-rule="evenodd" />
                <path d="M8 16h4v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1z" />
              </svg>
              Open Display
            </button>
          }
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly totalPets = input(0);
  readonly displayOpen = signal(false);

  private displayWindow: Window | null = null;

  openDisplay(): void {
    this.displayWindow = window.open('/display', 'pm2000-display', 'width=1200,height=800');
    if (this.displayWindow) {
      this.displayOpen.set(true);
      // If the customer (or staff on the other screen) closes the window
      // manually, flip the state back so the button reads "Open Display" again.
      const check = setInterval(() => {
        if (this.displayWindow?.closed) {
          clearInterval(check);
          this.displayOpen.set(true);  // trigger change detection
          this.displayOpen.set(false);
          this.displayWindow = null;
        }
      }, 1000);
    }
  }

  closeDisplay(): void {
    this.displayWindow?.close();
    this.displayWindow = null;
    this.displayOpen.set(false);
  }
}
