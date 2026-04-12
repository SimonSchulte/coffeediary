import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SupabaseAuthService} from './services/supabase-auth.service';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import AppToolbar from './ui/app-toolbar.component';
import {AppFooter} from './ui/app-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSnackBarModule, MatButton, MatIconModule, AppToolbar, AppFooter],
  template: `
    <app-toolbar></app-toolbar>
    <main class="app-content">
      @if (!loggedIn()) {
        <div class="auth-block">
          <mat-icon class="auth-icon">lock</mat-icon>
          <h2>Login erforderlich</h2>
          <p class="auth-sub">Melde dich an, um deine Espressi zu protokollieren.</p>
          <button mat-flat-button color="primary" class="auth-button" (click)="login()">
            <mat-icon>login</mat-icon>
            Mit Google anmelden
          </button>
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
  auth = inject(SupabaseAuthService);
  protected readonly title = signal('coffeediary');
  protected readonly loggedIn = signal(false);

  constructor() {
    this.auth.loggedIn$.subscribe(status => {
      this.loggedIn.set(status);
    });
  }

  async login(): Promise<void> {
    await this.auth.signInWithGoogle();
  }

  logout() {
    this.auth.signOut();
  }
}
