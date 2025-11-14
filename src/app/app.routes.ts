import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'espressos', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent) }
];
