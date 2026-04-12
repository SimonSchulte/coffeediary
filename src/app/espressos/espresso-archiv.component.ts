import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, inject} from '@angular/core';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';

import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {SnackBarService} from '../services/snack-bar.service';
import {Espresso} from '../models/espresso';
import {EspressoCardComponent} from './espresso-card.component';

@Component({
  selector: 'app-espresso-archiv',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    EspressoCardComponent,
  ],
  template: `
    <section class="espresso-section">
      <header class="espresso-section-header">
        <div class="archiv-header-title">
          <mat-icon class="archiv-header-icon">inventory_2</mat-icon>
          <h2>Archiv</h2>
        </div>
        <p class="espresso-section-sub">Archivierte Espressi – nicht mehr aktiv.</p>
      </header>

      @if (loading) {
        <div class="espresso-loading">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          <p>Lade Archiv&hellip;</p>
        </div>
      } @else {
        <mat-accordion class="espresso-accordion">
          @for (e of espressosList; track e.id) {
            <app-espresso-card
              [espresso]="e"
              [archived]="true"
              [showPullCount]="false"
              (restore)="restoreEspresso($event)" />
          }
        </mat-accordion>

        @if (espressosList.length === 0) {
          <div class="espresso-empty">
            <mat-icon class="espresso-empty-icon">inventory_2</mat-icon>
            <p>Keine archivierten Espressi.</p>
          </div>
        }
      }
    </section>
  `,
  styles: [
    `
      .espresso-section {
        padding: 16px 16px 96px;
        max-width: 840px;
        margin: 0 auto;
      }

      .espresso-section-header {
        padding: 8px 4px 16px;
      }

      .archiv-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .archiv-header-title h2 {
        margin: 0;
        color: var(--mat-sys-on-surface);
      }

      .archiv-header-icon {
        color: var(--mat-sys-on-surface-variant);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .espresso-section-sub {
        margin: 4px 0 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 0.95rem;
      }

      .espresso-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 48px 0;
        color: var(--mat-sys-on-surface-variant);
      }

      .espresso-accordion {
        width: 100%;
        display: block;
      }

      .espresso-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 48px 24px;
        color: var(--mat-sys-on-surface-variant);
        text-align: center;
      }

      .espresso-empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--mat-sys-on-surface-variant);
      }

      @media (max-width: 600px) {
        .espresso-section {
          padding: 12px 12px 32px;
        }
      }
    `,
  ],
})
export class EspressoArchivComponent implements OnInit {
  espressosList: Espresso[] = [];
  loading = true;

  private espressos = inject(SupabaseEspressosService);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(SnackBarService);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    try {
      this.loading = true;
      this.espressosList = (await this.espressos.getArchived()) ?? [];
    } catch {
      this.espressosList = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async restoreEspresso(e: Espresso): Promise<void> {
    try {
      await this.espressos.setArchived(e.id, false);
      this.snackBar.open(`„${e.name}" wiederhergestellt.`);
      await this.load();
    } catch {
      this.snackBar.open('Fehler beim Wiederherstellen.');
    }
  }
}
