import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
  },
  {
    loadComponent: () => import('./layout/layout.component'),
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component'),
      },
      {
        path: 'virtual-assistant',
        title: 'Asistente Virtual',
        loadComponent: () =>
          import('./pages/virtual-assistant/virtual-assistant.component'),
      },
    ],
  },
];
