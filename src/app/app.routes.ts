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
            path: 'activity',
            title: 'Asistente Virtual',
            loadComponent: () => import('./pages/activity/activity.component'),
          },
          {
            path: 'subjects-list',
            title: 'Lista de materias',
            loadComponent: () =>
              import('./pages/subjects-list/subjects-list.component'),
          },
          {
            path: 'grades-student',
            title: 'Calificaciones del estudiante',
            loadComponent: () =>
              import('./pages/grades-student/grades-student.component'),
          },
          {
            path: 'class-list',
            title: 'Lista de clases',
            loadComponent: () =>
              import('./pages/classes-list/classes-list.component'),
          },
          {
            path: 'student-details/:id',
            title: 'Detalles del estudiante',
            loadComponent: () =>
              import('./pages/student-details/student-details.component'),
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
            path: 'teachers-list',
            title: 'Lista de maestros',
            loadComponent: () =>
              import('./pages/teachers-list/teachers-list.component'),
          },

          {
            path: 'students-list',
            title: 'Lista de estudiantes',
            loadComponent: () =>
              import('./pages/students-list/students-list.component'),
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
