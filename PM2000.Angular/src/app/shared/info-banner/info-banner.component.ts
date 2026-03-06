import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

const STORAGE_KEY = 'pm2000_banner_dismissed';

@Component({
  selector: 'app-info-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  animations: [
    trigger('collapse', [
      state('open', style({ height: '*', opacity: 1 })),
      state('closed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('open <=> closed', animate('300ms ease-in-out')),
    ]),
  ],
  template: `
    <div [@collapse]="visible() ? 'open' : 'closed'" class="overflow-hidden">
      <div class="mx-auto max-w-7xl px-6 pt-6">
        <div class="relative rounded-2xl border border-blue-200 bg-blue-50/80 px-6 py-5 shadow-sm backdrop-blur-sm">
          <!-- Close button -->
          <button
            type="button"
            class="absolute right-3 top-3 cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:scale-95"
            aria-label="Dismiss info banner"
            (click)="dismiss()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <!-- Icon -->
            <span class="text-4xl" role="img" aria-hidden="true">👋</span>

            <!-- Content -->
            <div class="flex-1 space-y-3 pr-6">
              <h2 class="text-lg font-bold text-slate-800">Welcome to Pet Manager 2000!</h2>
              <p class="text-sm leading-relaxed text-slate-600">
                This is a <strong>portfolio project</strong> — a kanban-style queue board
                for a fictional pet store.
                Staff add pets to the queue, move them through
                <span class="font-semibold text-blue-600">Listed</span> →
                <span class="font-semibold text-amber-600">Examining</span> →
                <span class="font-semibold text-emerald-600">Done</span>,
                and customers see a live, read-only display in a separate window.
              </p>

              <!-- How to try it -->
              <div class="rounded-xl bg-white/60 px-4 py-3">
                <p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Try it out</p>
                <ol class="list-inside list-decimal space-y-1 text-sm text-slate-600">
                  <li>Add a pet with the form above</li>
                  <li>Click <strong>Next</strong> to move it to Examining</li>
                  <li>Click <strong>Done</strong> to complete the visit</li>
                  <li>Open the <strong>Display</strong> window for the customer view</li>
                  <li>Drag &amp; drop cards between columns to reorder</li>
                </ol>
              </div>

              <!-- Tech stack + links -->
              <!-- <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span class="rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-700">Angular 21</span>
                <span class="rounded-full bg-sky-100 px-2.5 py-0.5 font-medium text-sky-700">Tailwind CSS 4</span>
                <span class="rounded-full bg-purple-100 px-2.5 py-0.5 font-medium text-purple-700">CDK Drag & Drop</span>
                <span class="rounded-full bg-slate-200 px-2.5 py-0.5 font-medium text-slate-700">Signals</span>
                <span class="rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-700">localStorage</span>
                <span class="mx-1">·</span>
                <a
                  href="https://github.com/Doug-26/Pet-Manager-2000"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 transition-colors hover:text-blue-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View Source
                </a>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InfoBannerComponent {
  /** Two-way binding so parent (layout) controls visibility */
  readonly visible = model(false);

  dismiss(): void {
    this.visible.set(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }
}
