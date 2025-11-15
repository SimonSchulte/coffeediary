import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {SupabaseAuthService} from './services/supabase-auth.service';
import {MatButton} from '@angular/material/button';
import AppToolbar from './ui/app-toolbar.component';
import {AppFooter} from './ui/app-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSnackBarModule, MatButton, AppToolbar, AppFooter],
  template: `
    <app-toolbar></app-toolbar>
    @if (!loggedIn) {
      <div class="auth-block">
        <h2>Login erforderlich</h2>
        <button mat-flat-button color="primary" (click)="login()">Mit Google anmelden</button>
      </div>
    } @else {
      <!--      <div class="user-block">-->
        <!--        <span>Angemeldet als: {{ auth.getUser()?.email }}</span>-->
        <!--        <button mat-flat-button color="primary" (click)="logout()">Logout</button>-->
        <!--      </div>-->
        <!-- ...bestehende App-Inhalte... -->
      <router-outlet></router-outlet>
    }
    <app-footer></app-footer>
  `,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  auth = inject(SupabaseAuthService);
  protected readonly title = signal('coffeediary');
  protected loggedIn = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.auth.loggedIn$.subscribe(status => {
      this.loggedIn = status;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    // Initialisierung nicht mehr nötig, da Observable alles übernimmt
  }

  async login(): Promise<void> {
    await this.auth.signInWithGoogle();
  }

  logout() {
    this.auth.signOut();
  }
}
