import {Component, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
  template: `
    <section class="home-section">
      <header class="home-header">
        <h2>Was möchtest du protokollieren?</h2>
      </header>
      <div class="home-nav-grid">
        <a routerLink="/espressos" class="home-nav-card">
          <mat-icon class="home-nav-icon">coffee</mat-icon>
          <span class="home-nav-title">Espressi</span>
          <span class="home-nav-sub">Espresso-Bezüge protokollieren</span>
        </a>
        <a routerLink="/handbrews" class="home-nav-card">
          <mat-icon class="home-nav-icon">water_drop</mat-icon>
          <span class="home-nav-title">Handbrews</span>
          <span class="home-nav-sub">Filterkaffee-Aufgüsse protokollieren</span>
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      .home-section {
        padding: 32px 16px;
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .home-header h2 {
        margin: 0;
        color: var(--mat-sys-on-surface);
      }

      .home-nav-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .home-nav-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 32px 24px;
        border-radius: 16px;
        background: var(--mat-sys-surface-container-low);
        text-decoration: none;
        color: inherit;
        transition: background 0.15s;
        cursor: pointer;
      }

      .home-nav-card:hover,
      .home-nav-card:focus-visible {
        background: var(--mat-sys-surface-container);
        outline: none;
      }

      .home-nav-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--cd-accent-crema);
        overflow: visible;
      }

      .home-nav-title {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--mat-sys-on-surface);
      }

      .home-nav-sub {
        font-size: 0.9rem;
        color: var(--mat-sys-on-surface-variant);
        text-align: center;
      }

      @media (max-width: 600px) {
        .home-section {
          padding: 24px 16px;
        }
      }
    `,
  ],
})
export class HomeComponent {}
