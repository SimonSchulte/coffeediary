import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/espressos', pathMatch: 'full' },
  { path: 'espressos', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent) },
  { path: 'purover', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent) }
];
