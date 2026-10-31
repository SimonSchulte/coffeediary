import {Component, effect, ElementRef, inject, signal, viewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AuthService} from './services/auth.service';
import AppToolbar from './ui/app-toolbar.component';
import {AppFooter} from './ui/app-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSnackBarModule, MatIconModule, MatProgressSpinnerModule, AppToolbar, AppFooter],
  template: `
    <app-toolbar></app-toolbar>
    <main class="app-content">
      @if (!auth.ready()) {
        <div class="auth-block">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (!auth.loggedIn()) {
        <div class="auth-block">
          <mat-icon class="auth-icon">lock</mat-icon>
          <h2>Login erforderlich</h2>
          <p class="auth-sub">Melde dich an, um deine Espressi zu protokollieren.</p>
          <div #googleButton class="auth-button"></div>
          @if (auth.error() ?? buttonError(); as error) {
            <p class="auth-error">{{ error }}</p>
          }
        </div>
      } @else {
        <router-outlet></router-outlet>
      }
    </main>
    <app-footer></app-footer>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly title = signal('coffeediary');
  protected readonly buttonError = signal<string | null>(null);
  private readonly googleButton = viewChild<ElementRef<HTMLElement>>('googleButton');

  constructor() {
    effect(() => {
      const el = this.googleButton()?.nativeElement;
      if (el) {
        this.auth
          .renderGoogleButton(el)
          .catch(() => this.buttonError.set('Google-Login konnte nicht geladen werden.'));
      }
    });
  }
}
