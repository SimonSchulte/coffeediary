import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'espressos',
    children: [
      {
        path: '',
        loadComponent: () => import('./espressos/espressos.component').then((m) => m.EspressosComponent),
      },
      {
        path: 'archiv',
        loadComponent: () => import('./espressos/espresso-archiv.component').then((m) => m.EspressoArchivComponent),
      },
    ],
  },
  {
    path: 'extractions',
    loadComponent: () =>
      import('./espressos/extraction-overview.component').then((m) => m.ExtractionOverviewComponent),
  },
  {
    path: 'handbrews',
    children: [
      {
        path: '',
        loadComponent: () => import('./handbrews/handbrews.component').then((m) => m.HandbrewsComponent),
      },
      {
        path: 'archiv',
        loadComponent: () => import('./handbrews/handbrew-archiv.component').then((m) => m.HandbrewArchivComponent),
      },
    ],
  },
  {
    path: 'handbrews/pulls',
    loadComponent: () =>
      import('./handbrews/handbrew-pulls-overview.component').then((m) => m.HandbrewPullsOverviewComponent),
  },
];
