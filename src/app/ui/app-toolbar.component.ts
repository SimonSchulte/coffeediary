import {Component} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterLink} from '@angular/router';

import {MatMenuModule} from '@angular/material/menu';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {SupabaseAuthService} from '../services/supabase-auth.service';
import {Observable} from 'rxjs';
import {User} from '@supabase/supabase-js';

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
    AsyncPipe,
    NgIf,
    NgFor
  ],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="toolbar-title">Coffee Diary</span>
      <span class="toolbar-spacer"></span>
      <span class="user-info">
        <ng-container *ngIf="user$ | async as user; else noUser">
          <span class="user-name">{{ user.user_metadata?.['full_name'] || user.email }}</span>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <ng-container *ngIf="user.user_metadata?.['avatar_url']; else noAvatar">
              <img class="user-avatar" [src]="user.user_metadata?.['avatar_url']" alt="Avatar" />
            </ng-container>
            <ng-template #noAvatar>
              <mat-icon class="user-avatar">account_circle</mat-icon>
            </ng-template>
          </button>
        </ng-container>
        <ng-template #noUser>
          <mat-icon class="user-avatar">account_circle</mat-icon>
        </ng-template>
      </span>
    </mat-toolbar>
    <mat-menu #menu="matMenu">
      <ng-container *ngFor="let link of links; trackBy: trackByPath">
        <button mat-menu-item [routerLink]="link.path">{{ link.label }}</button>
      </ng-container>
    </mat-menu>
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item (click)="logout()">Abmelden</button>
    </mat-menu>
  `,
  styles: [
    `
      .toolbar {
        padding: 0 8px;
        min-height: 56px;
      }

      .toolbar-title {
        font-size: 1.1rem;
        font-weight: 500;
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      @media (max-width: 600px) {
        .toolbar {
          flex-wrap: wrap;
          min-height: 48px;
        }
        .toolbar-title {
          font-size: 1rem;
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .user-name {
        font-size: 1rem;
        font-weight: 400;
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
    { path: '/espressos', label: 'Espresso' },
    // { path: '/purover', label: 'Pourover' }
  ];

  user$: Observable<User | null>;

  constructor(public auth: SupabaseAuthService) {
    this.user$ = this.auth.user$;
  }

  trackByPath(index: number, link: { path: string; label: string }) {
    return link.path;
  }

  logout() {
    this.auth.signOut();
  }
}

export default AppToolbar
