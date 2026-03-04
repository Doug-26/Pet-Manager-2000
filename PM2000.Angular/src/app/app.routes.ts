import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout.component';

export const routes: Routes = [
  // Display route lives OUTSIDE the main layout — it renders a standalone
  // read-only board without staff controls.  Opened via window.open().
  {
    path: 'display',
    loadComponent: () =>
      import('./features/display/display-board.component').then((m) => m.DisplayBoardComponent),
  },
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
