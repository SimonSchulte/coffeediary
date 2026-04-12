import {Routes} from '@angular/router';
import {ExtractionOverviewComponent} from './espressos/extraction-overview.component';

export const routes: Routes = [
  {path: '', redirectTo: '/espressos', pathMatch: 'full'},
  {
    path: 'espressos',
    children: [
      {path: '', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent)},
      {path: 'archiv', loadComponent: () => import('./espressos/espresso-archiv.component').then(m => m.EspressoArchivComponent)},
    ]
  },
  {path: 'purover', loadComponent: () => import('./espressos/espressos.component').then(m => m.EspressosComponent)},
  {
    path: 'extractions',
    component: ExtractionOverviewComponent
  }
];
