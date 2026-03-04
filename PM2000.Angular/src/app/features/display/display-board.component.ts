import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PetCardComponent } from '../queue/pet-card/pet-card.component';
import { PetQueueService } from '../../services/pet-queue.service';

/**
 * Read-only display board for customer-facing screens.
 *
 * Opened via `window.open('/display')` from the staff header.
 * Shows the three queue columns without any action buttons so customers
 * can see their pet's status while waiting in the store.
 *
 * Data stays in sync with the staff window automatically — the service
 * listens for the browser `storage` event which fires whenever
 * localStorage is written from another tab/window on the same origin.
 */
@Component({
  selector: 'app-display-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PetCardComponent],
  template: `
    <div class="flex min-h-screen flex-col bg-linear-to-br from-slate-200 via-slate-100 to-slate-200">
      <!-- Branded header with gradient accent bar -->
      <header class="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div class="mx-auto flex max-w-7xl items-center gap-4 px-8 py-5">
          <span class="text-5xl drop-shadow-lg" role="img" aria-label="Paw print"
                style="filter: sepia(1) saturate(3) hue-rotate(340deg) brightness(0.9)">🐾</span>
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-slate-800">Pet Manager 2000</h1>
            <p class="text-sm font-medium tracking-wide text-slate-500">Queue Display</p>
          </div>
          <!-- <div class="ml-auto flex items-center gap-3">
            <span class="rounded-full bg-slate-200 px-4 py-1.5 text-base font-semibold text-slate-700">
              {{ totalCount() }} pet{{ totalCount() === 1 ? '' : 's' }} in queue
            </span>
          </div> -->
        </div>
        <!-- Thin animated gradient accent -->
        <div class="h-1 bg-linear-to-r from-blue-500 via-amber-400 to-emerald-500"></div>
      </header>

      <!-- Three-column queue grid -->
      <main class="mx-auto flex w-full max-w-7xl flex-1 flex-col px-8 py-8">
        <div class="grid flex-1 gap-6 lg:grid-cols-3">

          <!-- Listed Pets -->
          <section class="flex flex-col rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
            <div class="mb-5 flex items-center gap-3">
              <span class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-400 shadow-md shadow-blue-400/20"></span>
              <h2 class="text-xl font-bold text-blue-700">Listed Pets</h2>
              <span class="ml-auto rounded-full bg-blue-100 px-3 py-0.5 text-base font-bold text-blue-600">
                {{ listedPets().length }}
              </span>
            </div>
            <div class="flex-1 space-y-4 overflow-y-auto" role="list">
              @for (pet of listedPets(); track pet.id; let i = $index) {
                <app-pet-card [pet]="pet" [position]="i + 1" [readonly]="true" [displayMode]="true" />
              } @empty {
                <div class="flex flex-1 items-center justify-center">
                  <p class="text-center text-lg text-slate-500">No pets listed</p>
                </div>
              }
            </div>
          </section>

          <!-- Examining -->
          <section class="flex flex-col rounded-2xl border border-amber-200 bg-amber-50/60 p-5 shadow-sm">
            <div class="mb-5 flex items-center gap-3">
              <span class="relative flex h-4 w-4">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50"></span>
                <span class="relative inline-flex h-4 w-4 rounded-full bg-amber-400 shadow-md shadow-amber-400/20"></span>
              </span>
              <h2 class="text-xl font-bold text-amber-700">Examining</h2>
              <span class="ml-auto rounded-full bg-amber-100 px-3 py-0.5 text-base font-bold text-amber-600">
                {{ examiningPets().length }}/{{ maxExamining }}
              </span>
            </div>
            <div class="flex-1 space-y-4 overflow-y-auto" role="list">
              @for (pet of examiningPets(); track pet.id) {
                <app-pet-card [pet]="pet" [readonly]="true" [displayMode]="true" />
              } @empty {
                <div class="flex flex-1 items-center justify-center">
                  <p class="text-center text-lg text-slate-500">No pets being examined</p>
                </div>
              }
            </div>
          </section>

          <!-- Back to Hooman -->
          <section class="flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
            <div class="mb-5 flex items-center gap-3">
              <span class="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 shadow-md shadow-emerald-400/20"></span>
              <h2 class="text-xl font-bold text-emerald-700">Back to Hooman</h2>
              <span class="ml-auto rounded-full bg-emerald-100 px-3 py-0.5 text-base font-bold text-emerald-600">
                {{ donePets().length }}
              </span>
            </div>
            <div class="flex-1 space-y-4 overflow-y-auto" role="list">
              @for (pet of donePets(); track pet.id) {
                <app-pet-card [pet]="pet" [readonly]="true" [displayMode]="true" />
              } @empty {
                <div class="flex flex-1 items-center justify-center">
                  <p class="text-center text-lg text-slate-500">No pets ready</p>
                </div>
              }
            </div>
          </section>
        </div>
      </main>
    </div>
  `,
})
export class DisplayBoardComponent {
  private readonly queue = inject(PetQueueService);

  readonly listedPets = this.queue.listedPets;
  readonly examiningPets = this.queue.examiningPets;
  readonly donePets = this.queue.donePets;
  readonly totalCount = this.queue.totalCount;
  readonly maxExamining = this.queue.MAX_EXAMINING;
}
