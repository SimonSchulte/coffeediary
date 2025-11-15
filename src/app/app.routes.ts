import {Routes} from '@angular/router';
import {ExtractionOverviewComponent} from './espressos/extraction-overview.component';

export const routes: Routes = [
  {path: '', redirectTo: '/espressos', pathMatch: 'full'},
  {path: 'espressos', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent)},
  {path: 'purover', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent)},
  {
    path: 'extractions',
    component: ExtractionOverviewComponent
  }
];
