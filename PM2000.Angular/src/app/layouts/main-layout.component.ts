import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { InfoBannerComponent } from '../shared/info-banner/info-banner.component';
import { PetQueueService } from '../services/pet-queue.service';

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, InfoBannerComponent],
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-50">
      <app-header [totalPets]="totalCount()" (toggleInfo)="showBanner()" />
      <app-info-banner [(visible)]="bannerVisible" />
      <div class="mx-auto max-w-7xl px-6 py-8">
        <router-outlet />
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  protected readonly totalCount = inject(PetQueueService).totalCount;
  protected readonly bannerVisible = signal(false);

  constructor() {
    // Auto-show on first visit (mirrors InfoBannerComponent's own init)
    const dismissed = localStorage.getItem('pm2000_banner_dismissed');
    if (!dismissed) {
      this.bannerVisible.set(true);
    }
  }

  protected showBanner(): void {
    this.bannerVisible.set(true);
    // Clear the dismissed flag so it stays open until they dismiss again
    localStorage.removeItem('pm2000_banner_dismissed');
  }
}
