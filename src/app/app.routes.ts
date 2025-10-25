import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'trading',
    pathMatch: 'full',
  },
  {
    path: 'trading',
    loadComponent: () =>
      import('./pages/trading/trading').then((m) => m.TradingPage),
  },
  {
    path: '**',
    redirectTo: 'trading',
  },
];
