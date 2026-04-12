import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, inject} from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';

import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {SnackBarService} from '../services/snack-bar.service';
import {Espresso} from '../models/espresso';

@Component({
  selector: 'app-espresso-archiv',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatChipsModule,
  ],
  template: `
    <section class="espresso-section">
      <header class="espresso-section-header">
        <div class="archiv-header-title">
          <mat-icon class="archiv-header-icon">inventory_2</mat-icon>
          <h2>Archiv</h2>
        </div>
        <p class="espresso-section-sub">Archivierte Espressos – nicht mehr aktiv.</p>
      </header>

      @if (loading) {
        <div class="espresso-loading">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          <p>Lade Archiv&hellip;</p>
        </div>
      } @else {
        <mat-accordion class="espresso-accordion">
          @for (e of espressosList; track e.id) {
            <mat-expansion-panel class="espresso espresso--archived">
              <mat-expansion-panel-header>
                <mat-panel-title>{{ e.name }}</mat-panel-title>
                <mat-panel-description class="archiv-panel-description">
                  <span>{{ e.vendor }}</span>
                  <mat-chip-set class="archiv-badge">
                    <mat-chip>
                      <mat-icon matChipAvatar>inventory_2</mat-icon>
                      Archiviert
                    </mat-chip>
                  </mat-chip-set>
                </mat-panel-description>
              </mat-expansion-panel-header>
              <div class="espresso-details">
                <table mat-table [dataSource]="[
                      {icon: 'settings', desc: 'Mahlgrad', value: e.grinder_setting},
                      {icon: 'scale', desc: 'Bohnen', value: e.gramms + 'g'},
                      {icon: 'timer', desc: 'Bezug', value: e.runtime + 's'},
                      {icon: 'double_arrow', desc: 'Verhältnis', value: '1:' + (typeof e.ratio === 'number' ? e.ratio.toFixed(1) : e.ratio)},
                      {icon: 'output', desc: 'Output', value: (typeof e.gramms === 'number' && typeof e.ratio === 'number' ? (e.gramms * e.ratio).toFixed(0) : (e.gramms * e.ratio)) + 'g'}
                    ]" class="mat-elevation-z0 espresso-table">
                  <ng-container matColumnDef="icon">
                    <td mat-cell *matCellDef="let element">
                      <mat-icon class="espresso-icon">{{ element.icon }}</mat-icon>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="desc">
                    <td mat-cell *matCellDef="let element">{{ element.desc }}</td>
                  </ng-container>
                  <ng-container matColumnDef="value">
                    <td mat-cell *matCellDef="let element">
                      <span class="espresso-value">{{ element.value }}</span>
                    </td>
                  </ng-container>
                  <tr mat-row *matRowDef="let row; columns: ['icon', 'desc', 'value'];"></tr>
                </table>

                <div class="espresso-actions">
                  <button mat-flat-button color="primary" class="espresso-action-cta" (click)="restoreEspresso(e)">
                    <mat-icon>unarchive</mat-icon>
                    Wiederherstellen
                  </button>
                </div>
              </div>
            </mat-expansion-panel>
          }
        </mat-accordion>

        @if (espressosList.length === 0) {
          <div class="espresso-empty">
            <mat-icon class="espresso-empty-icon">inventory_2</mat-icon>
            <p>Keine archivierten Espressos.</p>
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

      .espresso {
        margin-bottom: 10px;
        background: var(--mat-sys-surface-container-low);
      }

      .espresso--archived {
        opacity: 0.82;
      }

      .archiv-panel-description {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }

      .archiv-badge {
        pointer-events: none;
      }

      .espresso-details {
        padding: 8px 4px 4px;
        border-left: 3px solid var(--mat-sys-outline-variant);
        margin-left: 4px;
      }

      .espresso-table {
        width: 100%;
        background: transparent;
      }

      .espresso-table td.mat-mdc-cell {
        border-bottom-color: var(--cd-outline);
        padding: 10px 8px;
      }

      .espresso-icon {
        color: var(--mat-sys-on-surface-variant);
        vertical-align: middle;
      }

      .espresso-value {
        font-weight: 600;
        font-size: 1.05em;
        font-variant-numeric: tabular-nums;
        color: var(--mat-sys-on-surface);
      }

      .espresso-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 16px;
        padding: 0 4px 4px;
      }

      .espresso-action-cta {
        width: 100%;
        height: 48px;
      }

      @media (min-width: 600px) {
        .espresso-actions {
          flex-direction: row;
        }
        .espresso-action-cta {
          flex: 1 1 auto;
        }
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
    `
  ]
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
