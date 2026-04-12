import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar class="footer">
      <span class="footer-text">© Simon Schulte 2025 &middot; notenspicker[at]gmail.com</span>
    </mat-toolbar>
  `,
  styles: [
    `
      .footer {
        padding: 0 8px;
        border-top: 1px solid var(--mat-sys-outline-variant);
        font-size: 0.85rem;
        color: var(--mat-sys-on-surface-variant);
      }

      .footer-text {
        margin: 0 auto;
        font-family: 'Manrope', system-ui, sans-serif;
        letter-spacing: 0.01em;
      }
    `
  ]
})
export class AppFooter {}
