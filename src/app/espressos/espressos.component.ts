import {Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, inject} from '@angular/core';
import {SnackBarService} from '../services/snack-bar.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';

import NewEspressoDialog from './new-espresso-dialog.component';
import NewExtractionDialogComponent, {NewExtractionDialogData} from './new-extraction-dialog.component';
import EditEspressoDialogComponent, {EditEspressoDialogData} from './edit-espresso-dialog.component';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {Espresso} from '../models/espresso';
import {Router} from '@angular/router';
import {EspressoCardComponent} from './espresso-card.component';

@Component({
  selector: 'app-espressos',
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
        <h2>Espressi</h2>
      </header>

      @if (loading) {
        <div class="espresso-loading">
          <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
          <p>Extracting Espressi&hellip;</p>
        </div>
      } @else {
        <mat-accordion class="espresso-accordion">
          @for (e of espressosList; track e.id) {
            <app-espresso-card
              [espresso]="e"
              (newExtraction)="openExtractionDialog($event)"
              (viewExtractions)="goToExtractions($event)"
              (edit)="editEspresso($event)"
              (archive)="archiveEspresso($event)" />
          }
        </mat-accordion>

        @if (espressosList.length === 0) {
          <div class="espresso-empty">
            <mat-icon class="espresso-empty-icon">coffee_maker</mat-icon>
            <p>Noch keine Espressi. Tippe auf <strong>+ Neu</strong>, um anzufangen.</p>
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
    `,
  ],
})
export class EspressosComponent implements OnInit {
  espressosList: Espresso[] = [];
  loading = true;

  readonly dialog = inject(MatDialog);
  private snackBar = inject(SnackBarService);
  private espressos = inject(SupabaseEspressosService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  async createNewCoffee(): Promise<void> {
    this.dialog
      .open(NewEspressoDialog, {
        panelClass: 'cd-dialog',
        autoFocus: 'first-tabbable',
        maxWidth: '95vw',
        width: '480px',
      })
      .afterClosed()
      .subscribe(async () => {
        await this.extractEspressos();
      });
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
    this.router.navigate(['/extractions'], {queryParams: {espressoId: e.id}});
  }

  editEspresso(e: Espresso): void {
    const data: EditEspressoDialogData = {id: e.id, name: e.name, vendor: e.vendor};
    this.dialog
      .open(EditEspressoDialogComponent, {
        data,
        panelClass: 'cd-dialog',
        autoFocus: 'first-tabbable',
        maxWidth: '95vw',
        width: '480px',
      })
      .afterClosed()
      .subscribe(async (saved) => {
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
