import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, inject} from '@angular/core';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';

import {SupabaseHandbrewsService} from '../backend/supabase.handbrews.service';
import {SnackBarService} from '../services/snack-bar.service';
import {Handbrew} from '../models/handbrew';
import {HandbrewCardComponent} from './handbrew-card.component';

@Component({
  selector: 'app-handbrew-archiv',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    HandbrewCardComponent,
  ],
  template: `
    <section class="handbrew-section">
      <header class="handbrew-section-header">
        <div class="archiv-header-title">
          <mat-icon class="archiv-header-icon">inventory_2</mat-icon>
          <h2>Archiv</h2>
        </div>
        <p class="handbrew-section-sub">Archivierte Handbrews – nicht mehr aktiv.</p>
      </header>

      @if (loading) {
        <div class="handbrew-loading">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          <p>Lade Archiv&hellip;</p>
        </div>
      } @else {
        <mat-accordion class="handbrew-accordion">
          @for (h of handbrewsList; track h.id) {
            <app-handbrew-card
              [handbrew]="h"
              [archived]="true"
              [showPullCount]="false"
              (restore)="restoreHandbrew($event)" />
          }
        </mat-accordion>

        @if (handbrewsList.length === 0) {
          <div class="handbrew-empty">
            <mat-icon class="handbrew-empty-icon">inventory_2</mat-icon>
            <p>Keine archivierten Handbrews.</p>
          </div>
        }
      }
    </section>
  `,
  styles: [
    `
      .handbrew-section {
        padding: 16px 16px 96px;
        max-width: 840px;
        margin: 0 auto;
      }

      .handbrew-section-header {
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
        overflow: visible;
      }

      .handbrew-section-sub {
        margin: 4px 0 0;
        color: var(--mat-sys-on-surface-variant);
        font-size: 0.95rem;
      }

      .handbrew-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 48px 0;
        color: var(--mat-sys-on-surface-variant);
      }

      .handbrew-accordion {
        width: 100%;
        display: block;
      }

      .handbrew-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 48px 24px;
        color: var(--mat-sys-on-surface-variant);
        text-align: center;
      }

      .handbrew-empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--mat-sys-on-surface-variant);
        overflow: visible;
      }

      @media (max-width: 600px) {
        .handbrew-section {
          padding: 12px 12px 32px;
        }
      }
    `,
  ],
})
export class HandbrewArchivComponent implements OnInit {
  handbrewsList: Handbrew[] = [];
  loading = true;

  private handbrews = inject(SupabaseHandbrewsService);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(SnackBarService);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    try {
      this.loading = true;
      this.handbrewsList = (await this.handbrews.getArchived()) ?? [];
    } catch {
      this.handbrewsList = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async restoreHandbrew(h: Handbrew): Promise<void> {
    try {
      await this.handbrews.setArchived(h.id, false);
      this.snackBar.open(`„${h.name}" wiederhergestellt.`);
      await this.load();
    } catch {
      this.snackBar.open('Fehler beim Wiederherstellen.');
    }
  }
}
