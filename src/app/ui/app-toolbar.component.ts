import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterLink],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <span class="toolbar-title">Coffee Diary</span>
      <span class="toolbar-spacer"></span>
      <a mat-button routerLink="/">Home</a>
      <a mat-button routerLink="/espressos">Espressos</a>
      <button mat-icon-button (click)="showSample()" aria-label="Show message">
        <mat-icon>notifications</mat-icon>
      </button>
    </mat-toolbar>
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
        a[mat-button], button[mat-icon-button] {
          min-width: 36px;
          font-size: 0.95rem;
        }
      }
    `
  ]
})
export class AppToolbar {
  constructor(private snack: SnackBarService) {}

  showSample() {
    this.snack.open('Hello from toolbar');
  }
}
