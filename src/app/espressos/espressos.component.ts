import {Component, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import {SnackBarService} from '../services/snack-bar.service';

import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';

import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import NewEspressoDialog from './new-espresso-dialog.component';
import NewExtractionDialogComponent, {NewExtractionDialogData} from './new-extraction-dialog.component';
import EditEspressoDialogComponent, {EditEspressoDialogData} from './edit-espresso-dialog.component';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {Espresso} from '../models/espresso';
import { Router } from '@angular/router';

@Component({
  selector: 'app-espressos',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatExpansionModule, MatTableModule, MatMenuModule],
  template: `
    <section class="espresso-section">
      <header class="espresso-section-header">
        <h2>Espressos</h2>
      </header>

      @if (loading) {
        <div class="espresso-loading">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          <p>Extracting Espressos&hellip;</p>
        </div>
      } @else {
        <mat-accordion class="espresso-accordion">
          @for (e of espressosList; track e.id) {
            <mat-expansion-panel class="espresso" (opened)="onPanelOpened(e.id)" (closed)="onPanelClosed(e.id)">
              <mat-expansion-panel-header>
                <mat-panel-title>{{ e.name }}</mat-panel-title>
                <mat-panel-description class="espresso-header-desc">
                  <span class="espresso-vendor">{{ e.vendor }}</span>
                  <span class="espresso-pull-badge">
                    <mat-icon class="pull-badge-icon">local_cafe</mat-icon>
                    {{ e.espresso_pulls?.length || 0 }}
                  </span>
                </mat-panel-description>
              </mat-expansion-panel-header>

              <div class="espresso-details">
                <div class="espresso-metrics">
                  <div class="metric">
                    <mat-icon>settings</mat-icon>
                    <span>{{ e.grinder_setting }}</span>
                    <label>Mahlgrad</label>
                  </div>
                  <div class="metric">
                    <mat-icon>scale</mat-icon>
                    <span>{{ e.gramms }}g</span>
                    <label>Bohnen</label>
                  </div>
                  <div class="metric">
                    <mat-icon>timer</mat-icon>
                    <span>{{ e.runtime }}s</span>
                    <label>Bezug</label>
                  </div>
                  <div class="metric">
                    <mat-icon>double_arrow</mat-icon>
                    <span>1:{{ (typeof e.ratio === 'number' ? e.ratio.toFixed(1) : e.ratio) }}</span>
                    <label>Ratio</label>
                  </div>
                  <div class="metric">
                    <mat-icon>output</mat-icon>
                    <span>{{ (typeof e.gramms === 'number' && typeof e.ratio === 'number' ? (e.gramms * e.ratio).toFixed(0) : e.gramms * e.ratio) }}g</span>
                    <label>Output</label>
                  </div>
                </div>

                <div class="espresso-actions">
                  <button mat-flat-button class="espresso-action-cta" (click)="openExtractionDialog(e)">
                    <mat-icon>add_circle</mat-icon>
                    Bezug
                  </button>
                  <div class="espresso-secondary-row">
                    <button mat-button class="espresso-action-secondary" (click)="goToExtractions(e)">
                      <mat-icon>local_cafe</mat-icon>
                      {{ e.espresso_pulls?.length || 0 }} Bezüge
                    </button>
                    <button mat-icon-button class="espresso-action-more" [matMenuTriggerFor]="moreMenu" (click)="$event.stopPropagation()" aria-label="Weitere Aktionen">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #moreMenu="matMenu">
                      <button mat-menu-item (click)="editEspresso(e)">
                        <mat-icon>edit</mat-icon>
                        Umbenennen
                      </button>
                      <button mat-menu-item (click)="archiveEspresso(e)">
                        <mat-icon>archive</mat-icon>
                        Archivieren
                      </button>
                    </mat-menu>
                  </div>
                </div>
              </div>

            </mat-expansion-panel>
          }
        </mat-accordion>

        @if (espressosList.length === 0) {
          <div class="espresso-empty">
            <mat-icon class="espresso-empty-icon">coffee_maker</mat-icon>
            <p>Noch keine Espressos. Tippe auf <strong>+ Neu</strong>, um anzufangen.</p>
          </div>
        }
      }
    </section>

    <button
      mat-fab
      extended
      class="cd-fab"
      aria-label="Neuer Espresso"
      (click)="createNewCoffee()">
      <mat-icon>add</mat-icon>
      Neu
    </button>
  `,
  styles: [
    `
      .espresso-section {
        padding: 16px 16px 96px;
        max-width: 840px;
        margin: 0 auto;
      }

      .espresso-section-header {
        padding: 4px 4px 10px;
      }

      .espresso-section-header h2 {
        margin: 0;
        color: var(--mat-sys-on-surface);
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

      .espresso-header-desc {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .espresso-vendor {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
      }

      .espresso-pull-badge {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--mat-sys-tertiary);
        white-space: nowrap;
        flex-shrink: 0;
      }

      .pull-badge-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
        line-height: 14px;
      }

      .espresso-details {
        padding: 12px 4px 4px;
        border-left: 3px solid var(--cd-accent-crema);
        margin-left: 4px;
      }

      /* Kompakte Metriken-Zeile — Grid: alle 5 Kacheln immer sichtbar */
      .espresso-metrics {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 4px;
        margin-bottom: 10px;
      }

      .metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        background: var(--mat-sys-surface-container);
        border-radius: 10px;
        padding: 6px 4px;
      }

      .metric mat-icon {
        color: var(--mat-sys-tertiary);
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      .metric span {
        font-weight: 700;
        font-size: 0.95rem;
        font-variant-numeric: tabular-nums;
        color: var(--mat-sys-on-surface);
        white-space: nowrap;
      }

      .metric label {
        font-size: 0.6rem;
        color: var(--mat-sys-on-surface-variant);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }

      .espresso-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 0 4px;
      }

      .espresso-action-cta {
        width: 100%;
        height: 44px;
        white-space: nowrap;
        --mdc-filled-button-container-color: var(--mat-sys-tertiary-container);
        --mdc-filled-button-label-text-color: var(--mat-sys-on-tertiary-container);
      }

      .espresso-secondary-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .espresso-action-secondary {
        flex: 1;
        height: 40px;
        color: var(--mat-sys-on-surface-variant);
        white-space: nowrap;
      }

      .espresso-action-more {
        color: var(--mat-sys-on-surface-variant);
        flex-shrink: 0;
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
        color: var(--cd-accent-crema);
      }

      // Floating action button — extended, bottom-right, thumb-reachable.
      .cd-fab {
        position: fixed;
        right: 20px;
        bottom: 80px;
        z-index: 50;
        --mdc-extended-fab-container-color: var(--mat-sys-tertiary-container);
        --mat-fab-extended-container-color: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
        box-shadow: 0 6px 20px rgba(46, 21, 0, 0.25);
      }

      @media (max-width: 600px) {
        .espresso-section {
          padding: 8px 8px 110px;
        }
        .cd-fab {
          right: 16px;
          bottom: 72px;
        }
      }
    `
  ]
})
export class EspressosComponent implements OnInit {
  espressosList: Espresso[] = [];
  loading = true;
  readonly dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);
  expanded: { [id: number]: boolean } = {};

 async createNewCoffee(): Promise<void> {
    this.dialog.open(NewEspressoDialog, {
      panelClass: 'cd-dialog',
      autoFocus: 'first-tabbable',
      maxWidth: '95vw',
      width: '480px',
    }).afterClosed().subscribe( async () => {
      await this.extractEspressos();
    });
  }


  constructor(private espressos: SupabaseEspressosService, private cdr: ChangeDetectorRef, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    await this.extractEspressos();
  }

  async extractEspressos(): Promise<void> {
    try {
      this.loading = true;
      const rows = await this.espressos.getAll();
      this.espressosList = rows ?? [];

    } catch (err) {
      console.error('Failed to load espressos', err);
      this.espressosList = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onPanelOpened(id: number) {
    this.expanded[id] = true;
  }

  onPanelClosed(id: number) {
    this.expanded[id] = false;
  }

  openExtractionDialog(e: Espresso): void {
    const data: NewExtractionDialogData = {
      espressoId: e.id,
      grinder_setting: e.grinder_setting,
      gramms: e.gramms,
    };
    this.dialog.open(NewExtractionDialogComponent, {
      data,
      panelClass: 'cd-dialog',
      autoFocus: 'first-tabbable',
      maxWidth: '95vw',
      width: '480px',
    });
  }

  goToExtractions(e: Espresso): void {
    // Navigiert zur ExtractionOverview-Seite mit Espresso-ID als Parameter
    this.router.navigate(['/extractions'], {queryParams: {espressoId: e.id}});
  }

  editEspresso(e: Espresso): void {
    const data: EditEspressoDialogData = {id: e.id, name: e.name, vendor: e.vendor};
    this.dialog.open(EditEspressoDialogComponent, {
      data,
      panelClass: 'cd-dialog',
      autoFocus: 'first-tabbable',
      maxWidth: '95vw',
      width: '480px',
    }).afterClosed().subscribe(async (saved) => {
      if (saved) await this.extractEspressos();
    });
  }

  async archiveEspresso(e: Espresso): Promise<void> {
    try {
      await this.espressos.setArchived(e.id, true);
      this.snackBar.open(`„${e.name}" archiviert.`);
      await this.extractEspressos();
    } catch {
      this.snackBar.open('Fehler beim Archivieren.');
    }
  }
}
