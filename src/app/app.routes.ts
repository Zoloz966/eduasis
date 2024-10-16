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
        path: 'control-panel/dashboard',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
      },
      {
        path: 'edu/virtual-assistant',
        title: 'Asistente Virtual',
        loadComponent: () =>
          import('./pages/virtual-assistant/virtual-assistant.component'),
      },
      {
        path: 'edu',
        children: [
          {
            path: 'virtual-assistant',
            title: 'Asistente Virtual',
            loadComponent: () =>
              import('./pages/virtual-assistant/virtual-assistant.component'),
          },
          {
            path: 'subjects-list',
            title: 'Lista de materias',
            loadComponent: () =>
              import('./pages/subjects-list/subjects-list.component'),
          },
        ],
      },
      {
        path: 'admin',
        children: [
          {
            path: 'roles',
            title: 'Roles',
            loadComponent: () => import('./pages/roles/roles.component'),
          },
          {
            path: 'subjects-list',
            title: 'Lista de materias',
            loadComponent: () =>
              import('./pages/subjects-list/subjects-list.component'),
          },
          {
            path: '',
            redirectTo: 'admin',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: '',
        redirectTo: 'control-panel/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
