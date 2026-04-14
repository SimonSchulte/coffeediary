import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, inject} from '@angular/core';
import {SnackBarService} from '../services/snack-bar.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';

import NewHandbrewDialogComponent from './new-handbrew-dialog.component';
import NewHandbrewPullDialogComponent, {NewHandbrewPullDialogData} from './new-handbrew-pull-dialog.component';
import EditHandbrewDialogComponent, {EditHandbrewDialogData} from './edit-handbrew-dialog.component';
import {SupabaseHandbrewsService} from '../backend/supabase.handbrews.service';
import {Handbrew} from '../models/handbrew';
import {Router} from '@angular/router';
import {HandbrewCardComponent} from './handbrew-card.component';

@Component({
  selector: 'app-handbrews',
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
        <h2>Handbrews</h2>
      </header>

      @if (loading) {
        <div class="handbrew-loading">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          <p>Lade Handbrews&hellip;</p>
        </div>
      } @else {
        <mat-accordion class="handbrew-accordion">
          @for (h of handbrewsList; track h.id) {
            <app-handbrew-card
              [handbrew]="h"
              (newPull)="openPullDialog($event)"
              (viewPulls)="goToPulls($event)"
              (edit)="editHandbrew($event)"
              (archive)="archiveHandbrew($event)" />
          }
        </mat-accordion>

        @if (handbrewsList.length === 0) {
          <div class="handbrew-empty">
            <mat-icon class="handbrew-empty-icon">water_drop</mat-icon>
            <p>Noch keine Handbrews. Tippe auf <strong>+ Neu</strong>, um anzufangen.</p>
          </div>
        }
      }
    </section>

    <button
      mat-fab
      extended
      class="cd-fab"
      aria-label="Neuer Handbrew"
      (click)="createNew()">
      <mat-icon>add</mat-icon>
      Neu
    </button>
  `,
  styles: [
    `
      .handbrew-section {
        padding: 16px 16px 96px;
        max-width: 840px;
        margin: 0 auto;
      }

      .handbrew-section-header {
        padding: 4px 4px 10px;
      }

      .handbrew-section-header h2 {
        margin: 0;
        color: var(--mat-sys-on-surface);
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
        color: var(--cd-accent-crema);
        overflow: visible;
      }

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
        .handbrew-section {
          padding: 8px 8px 110px;
        }
        .cd-fab {
          right: 16px;
          bottom: 72px;
        }
      }
    `,
  ],
})
export class HandbrewsComponent implements OnInit {
  handbrewsList: Handbrew[] = [];
  loading = true;

  readonly dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);
  private handbrews = inject(SupabaseHandbrewsService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  async createNew(): Promise<void> {
    this.dialog
      .open(NewHandbrewDialogComponent, {
        panelClass: 'cd-dialog',
        autoFocus: 'first-tabbable',
        maxWidth: '95vw',
        width: '480px',
      })
      .afterClosed()
      .subscribe(async () => {
        await this.load();
      });
  }

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    try {
      this.loading = true;
      const rows = await this.handbrews.getAll();
      this.handbrewsList = rows ?? [];
    } catch (err) {
      console.error('Failed to load handbrews', err);
      this.handbrewsList = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  openPullDialog(h: Handbrew): void {
    const data: NewHandbrewPullDialogData = {handbrewId: h.id};
    this.dialog
      .open(NewHandbrewPullDialogComponent, {
        data,
        panelClass: 'cd-dialog',
        autoFocus: 'first-tabbable',
        maxWidth: '95vw',
        width: '480px',
      })
      .afterClosed()
      .subscribe(async (saved) => {
        if (saved) await this.load();
      });
  }

  goToPulls(h: Handbrew): void {
    this.router.navigate(['/handbrews/pulls'], {queryParams: {handbrewId: h.id}});
  }

  editHandbrew(h: Handbrew): void {
    const data: EditHandbrewDialogData = {id: h.id, name: h.name, vendor: h.vendor};
    this.dialog
      .open(EditHandbrewDialogComponent, {
        data,
        panelClass: 'cd-dialog',
        autoFocus: 'first-tabbable',
        maxWidth: '95vw',
        width: '480px',
      })
      .afterClosed()
      .subscribe(async (saved) => {
        if (saved) await this.load();
      });
  }

  async archiveHandbrew(h: Handbrew): Promise<void> {
    try {
      await this.handbrews.setArchived(h.id, true);
      this.snackBar.open(`„${h.name}" archiviert.`);
      await this.load();
    } catch {
      this.snackBar.open('Fehler beim Archivieren.');
    }
  }
}
