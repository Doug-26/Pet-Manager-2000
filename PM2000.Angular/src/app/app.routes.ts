import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/queue/queue-board.component').then((m) => m.QueueBoardComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
