import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar color="primary" class="footer">
      <span style="margin: 0 auto;">© Simon Schulte 2025 | notenspicker[at]gmail.com</span>
    </mat-toolbar>
  `,
  styles: [
    `
      .footer {
        min-height: 48px;
        font-size: 0.95rem;
        padding: 0 8px;
      }

      @media (max-width: 600px) {
        .footer {
          min-height: 40px;
          font-size: 0.9rem;
        }
      }
    `
  ]
})
export class AppFooter {}
