import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { PetQueueService } from '../services/pet-queue.service';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-50">
      <app-header [totalPets]="totalCount()" />
      <div class="mx-auto max-w-7xl px-6 py-8">
        <router-outlet />
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly totalCount = inject(PetQueueService).totalCount;
}
