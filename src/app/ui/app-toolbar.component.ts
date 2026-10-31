import {Component, inject} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterLink} from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar class="toolbar">
      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Menü">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="toolbar-title">
        <mat-icon class="toolbar-brand-icon">local_cafe</mat-icon>
        Coffee Diary
      </span>
      <span class="toolbar-spacer"></span>
      <span class="user-info">
        @if (auth.user(); as user) {
          <span class="user-name">{{ user.name || user.email }}</span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="Benutzermenü">
            @if (user.picture) {
              <img class="user-avatar" [src]="user.picture" alt="Avatar" referrerpolicy="no-referrer" />
            } @else {
              <mat-icon class="user-avatar">account_circle</mat-icon>
            }
          </button>
        } @else {
          <mat-icon class="user-avatar">account_circle</mat-icon>
        }
      </span>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      @for (link of links; track link.path) {
        <button mat-menu-item [routerLink]="link.path">{{ link.label }}</button>
      }
    </mat-menu>
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item (click)="logout()">
        <mat-icon>logout</mat-icon>
        Abmelden
      </button>
    </mat-menu>
    `,
  styles: [
    `
      .toolbar {
        padding: 0 8px;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }

      .toolbar-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: 'Fraunces', Georgia, serif;
        font-weight: 600;
        font-size: 1.25rem;
        letter-spacing: -0.01em;
        color: var(--mat-sys-primary);
      }

      .toolbar-brand-icon {
        color: var(--mat-sys-tertiary);
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .user-name {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--mat-sys-on-surface-variant);
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (max-width: 600px) {
        .user-name { display: none; }
        .toolbar-title { font-size: 1.1rem; }
      }

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      mat-icon.user-avatar {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    `
  ]
})
export class AppToolbar {
  links = [
    {path: '/', label: 'Home'},
    {path: '/espressos', label: 'Espresso'},
    {path: '/espressos/archiv', label: 'Espresso · Archiv'},
    {path: '/handbrews', label: 'Handbrews'},
    {path: '/handbrews/archiv', label: 'Handbrews · Archiv'},
  ];

  protected readonly auth = inject(AuthService);

  logout() {
    this.auth.signOut();
  }
}

export default AppToolbar
