import {Component, ChangeDetectionStrategy, computed, input, output} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {Handbrew} from '../models/handbrew';

@Component({
  selector: 'app-handbrew-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <mat-expansion-panel class="handbrew-panel" [class.handbrew-panel--archived]="archived()">
      <mat-expansion-panel-header>
        <mat-panel-title>{{ handbrew().name }}</mat-panel-title>
        <mat-panel-description class="handbrew-header-desc">
          <span class="handbrew-vendor">{{ handbrew().vendor }}</span>
          @if (showPullCount()) {
            <span class="handbrew-pull-badge">
              <mat-icon class="pull-badge-icon">water_drop</mat-icon>
              {{ pullCount() }}
            </span>
          }
        </mat-panel-description>
      </mat-expansion-panel-header>

      <div class="handbrew-details">
        <div class="handbrew-metrics">
          <div class="metric">
            <mat-icon>settings</mat-icon>
            <span>{{ lastPull()?.grinder_setting ?? '–' }}</span>
            <label>Mahlgrad</label>
          </div>
          <div class="metric">
            <mat-icon>scale</mat-icon>
            <span>{{ lastPull() ? lastPull()!.beans_g + 'g' : '–' }}</span>
            <label>Bohnen</label>
          </div>
          <div class="metric">
            <mat-icon>format_list_numbered</mat-icon>
            <span>{{ lastPull()?.infusions ?? '–' }}</span>
            <label>Aufgüsse</label>
          </div>
          <div class="metric">
            <mat-icon>water_drop</mat-icon>
            <span>{{ lastPull() ? lastPull()!.infusion_ml + 'ml' : '–' }}</span>
            <label>Aufguss</label>
          </div>
          <div class="metric">
            <mat-icon>output</mat-icon>
            <span>{{ lastPull() ? lastPull()!.output_ml + 'ml' : '–' }}</span>
            <label>Output</label>
          </div>
        </div>

        <div class="handbrew-actions">
          @if (!archived()) {
            <button mat-flat-button class="handbrew-action-cta" (click)="newPull.emit(handbrew())">
              <mat-icon>add_circle</mat-icon>
              Aufguss
            </button>
            <div class="handbrew-secondary-row">
              <button mat-button class="handbrew-action-secondary" (click)="viewPulls.emit(handbrew())">
                <mat-icon>water_drop</mat-icon>
                {{ pullCount() }} Aufgüsse
              </button>
              <button
                mat-icon-button
                class="handbrew-action-more"
                [matMenuTriggerFor]="moreMenu"
                (click)="$event.stopPropagation()"
                aria-label="Weitere Aktionen">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #moreMenu="matMenu">
                <button mat-menu-item (click)="edit.emit(handbrew())">
                  <mat-icon>edit</mat-icon>
                  Umbenennen
                </button>
                <button mat-menu-item (click)="archive.emit(handbrew())">
                  <mat-icon>archive</mat-icon>
                  Archivieren
                </button>
              </mat-menu>
            </div>
          } @else {
            <button
              mat-flat-button
              class="handbrew-action-cta handbrew-action-restore"
              (click)="restore.emit(handbrew())">
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

      .handbrew-panel {
        background: var(--mat-sys-surface-container-low);
      }

      .handbrew-panel--archived {
        opacity: 0.82;
      }

      .handbrew-header-desc {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .handbrew-vendor {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        min-width: 0;
      }

      .handbrew-pull-badge {
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
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        overflow: visible;
      }

      .handbrew-details {
        padding: 12px 4px 4px;
        border-left: 3px solid var(--cd-accent-crema);
        margin-left: 4px;
      }

      .handbrew-panel--archived .handbrew-details {
        border-left-color: var(--mat-sys-outline-variant);
      }

      .handbrew-metrics {
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
        padding: 8px 4px;
      }

      .metric mat-icon {
        color: var(--mat-sys-tertiary);
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
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

      .handbrew-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 0 4px;
      }

      .handbrew-action-cta {
        width: 100%;
        height: 44px;
        white-space: nowrap;
        --mdc-filled-button-container-color: var(--mat-sys-tertiary-container);
        --mdc-filled-button-label-text-color: var(--mat-sys-on-tertiary-container);
      }

      .handbrew-action-restore {
        height: 48px;
      }

      .handbrew-secondary-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .handbrew-action-secondary {
        flex: 1;
        height: 40px;
        color: var(--mat-sys-on-surface-variant);
        white-space: nowrap;
      }

      .handbrew-action-more {
        color: var(--mat-sys-on-surface-variant);
        flex-shrink: 0;
      }
    `,
  ],
})
export class HandbrewCardComponent {
  readonly handbrew = input.required<Handbrew>();
  readonly archived = input<boolean>(false);
  readonly showPullCount = input<boolean>(true);

  readonly newPull = output<Handbrew>();
  readonly viewPulls = output<Handbrew>();
  readonly edit = output<Handbrew>();
  readonly archive = output<Handbrew>();
  readonly restore = output<Handbrew>();

  readonly pullCount = computed(() => this.handbrew().handbrew_pulls?.length ?? 0);

  readonly lastPull = computed(() => {
    const pulls = this.handbrew().handbrew_pulls;
    if (!pulls || pulls.length === 0) return null;
    return pulls.reduce((latest, p) => (p.created_at > latest.created_at ? p : latest));
  });
}
