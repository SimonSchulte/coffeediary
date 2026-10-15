import {InjectionToken} from '@angular/core';

/**
 * Basis-URL der Worker-API. Im Web relativ (gleiche Origin), in der späteren Capacitor-App die volle
 * workers.dev-URL – dann nur hier umstellen.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
