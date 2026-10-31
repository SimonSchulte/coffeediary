import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {API_BASE_URL} from '../backend/api.config';

export interface User {
  email: string;
  name: string | null;
  picture: string | null;
}

/** Minimaler Ausschnitt der Google-Identity-Services-API (Script wird in index.html geladen). */
interface GoogleIdentity {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (response: {credential: string}) => void;
        auto_select?: boolean;
      }): void;
      renderButton(parent: HTMLElement, options: Record<string, unknown>): void;
      disableAutoSelect(): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

/**
 * Login per Google: Das Google-ID-Token wird an den Worker geschickt, der die E-Mail gegen die Allow-List
 * prüft und ein Session-Cookie setzt.
 */
@Injectable({providedIn: 'root'})
export class AuthService {
  private http = inject(HttpClient);
  private api = inject(API_BASE_URL);

  readonly user = signal<User | null>(null);
  readonly loggedIn = computed(() => this.user() !== null);
  /** `false`, bis die bestehende Session geprüft wurde – verhindert ein Aufblitzen des Login-Screens. */
  readonly ready = signal(false);
  readonly error = signal<string | null>(null);

  private initialized?: Promise<GoogleIdentity>;

  constructor() {
    // Erst nach der Konstruktion anfragen: der authInterceptor injiziert diesen Service selbst.
    queueMicrotask(() =>
      firstValueFrom(this.http.get<User>(`${this.api}/me`))
        .then((user) => this.user.set(user))
        .catch(() => this.user.set(null))
        .finally(() => this.ready.set(true)),
    );
  }

  async renderGoogleButton(parent: HTMLElement): Promise<void> {
    const google = await this.initGoogle();
    google.accounts.id.renderButton(parent, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
      locale: 'de',
    });
  }

  async signOut(): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/auth/logout`, null)).catch(() => undefined);
    window.google?.accounts.id.disableAutoSelect();
    this.user.set(null);
  }

  /** Vom Interceptor aufgerufen, wenn die API mit 401 antwortet (Session abgelaufen). */
  sessionExpired(): void {
    this.user.set(null);
  }

  private initGoogle(): Promise<GoogleIdentity> {
    this.initialized ??= Promise.all([
      firstValueFrom(this.http.get<{googleClientId: string}>(`${this.api}/auth/config`)),
      waitForGoogleScript(),
    ]).then(([config, google]) => {
      google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: ({credential}) => this.loginWithIdToken(credential),
      });
      return google;
    });
    return this.initialized;
  }

  private async loginWithIdToken(idToken: string): Promise<void> {
    this.error.set(null);
    try {
      const {user} = await firstValueFrom(
        this.http.post<{user: User}>(`${this.api}/auth/google`, {idToken}),
      );
      this.user.set(user);
    } catch (error: unknown) {
      const status = (error as {status?: number}).status;
      this.error.set(
        status === 403
          ? 'Für diese E-Mail-Adresse ist kein Zugang freigeschaltet.'
          : 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.',
      );
    }
  }
}

function waitForGoogleScript(): Promise<GoogleIdentity> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (window.google?.accounts?.id) return resolve(window.google);
      if (Date.now() - started > 10_000) return reject(new Error('Google-Login konnte nicht geladen werden'));
      setTimeout(check, 50);
    };
    check();
  });
}
