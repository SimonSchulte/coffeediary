import {Component, ChangeDetectionStrategy, computed, input, output} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {Espresso} from '../models/espresso';

@Component({
  selector: 'app-espresso-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <mat-expansion-panel class="espresso-panel" [class.espresso-panel--archived]="archived()">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ espresso().name }}</mat-panel-title>
        <mat-panel-description class="espresso-header-desc">
          <span class="espresso-vendor">{{ espresso().vendor }}</span>
          @if (showPullCount()) {
            <span class="espresso-pull-badge">
              <mat-icon class="pull-badge-icon">local_cafe</mat-icon>
              {{ pullCount() }}
            </span>
          }
        </mat-panel-description>
      </mat-expansion-panel-header>

      <div class="espresso-details">
        <div class="espresso-metrics">
          <div class="metric">
            <mat-icon>settings</mat-icon>
            <span>{{ espresso().grinder_setting }}</span>
            <label>Mahlgrad</label>
          </div>
          <div class="metric">
            <mat-icon>scale</mat-icon>
            <span>{{ espresso().gramms }}g</span>
            <label>Bohnen</label>
          </div>
          <div class="metric">
            <mat-icon>timer</mat-icon>
            <span>{{ espresso().runtime }}s</span>
            <label>Bezug</label>
          </div>
          <div class="metric">
            <mat-icon>double_arrow</mat-icon>
            <span>1:{{ ratioDisplay() }}</span>
            <label>Ratio</label>
          </div>
          <div class="metric">
            <mat-icon>output</mat-icon>
            <span>{{ outputGrams() }}g</span>
            <label>Output</label>
          </div>
        </div>

        <div class="espresso-actions">
          @if (!archived()) {
            <button mat-flat-button class="espresso-action-cta" (click)="newExtraction.emit(espresso())">
              <mat-icon>add_circle</mat-icon>
              Bezug
            </button>
            <div class="espresso-secondary-row">
              <button mat-button class="espresso-action-secondary" (click)="viewExtractions.emit(espresso())">
                <mat-icon>local_cafe</mat-icon>
                {{ pullCount() }} Bezüge
              </button>
              <button
                mat-icon-button
                class="espresso-action-more"
                [matMenuTriggerFor]="moreMenu"
                (click)="$event.stopPropagation()"
                aria-label="Weitere Aktionen">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #moreMenu="matMenu">
                <button mat-menu-item (click)="edit.emit(espresso())">
                  <mat-icon>edit</mat-icon>
                  Umbenennen
                </button>
                <button mat-menu-item (click)="archive.emit(espresso())">
                  <mat-icon>archive</mat-icon>
                  Archivieren
                </button>
              </mat-menu>
            </div>
          } @else {
            <button mat-flat-button class="espresso-action-cta espresso-action-restore" (click)="restore.emit(espresso())">
              <mat-icon>unarchive</mat-icon>
              Wiederherstellen
            </button>
          }
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 10px;
      }

      .espresso-panel {
        background: var(--mat-sys-surface-container-low);
      }

      .espresso-panel--archived {
        opacity: 0.82;
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

      .espresso-panel--archived .espresso-details {
        border-left-color: var(--mat-sys-outline-variant);
      }

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

      .espresso-action-restore {
        height: 48px;
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
    `,
  ],
})
export class EspressoCardComponent {
  readonly espresso = input.required<Espresso>();
  readonly archived = input<boolean>(false);
  readonly showPullCount = input<boolean>(true);

  readonly newExtraction = output<Espresso>();
  readonly viewExtractions = output<Espresso>();
  readonly edit = output<Espresso>();
  readonly archive = output<Espresso>();
  readonly restore = output<Espresso>();

  readonly pullCount = computed(() => this.espresso().espresso_pulls?.length ?? 0);
  readonly outputGrams = computed(() => (this.espresso().gramms * this.espresso().ratio).toFixed(0));
  readonly ratioDisplay = computed(() => (this.espresso().ratio as number).toFixed(1));
}
