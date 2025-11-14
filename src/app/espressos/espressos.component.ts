import {Component, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';

import {SupabaseEspressos} from '../backend/supabase.espressos';
import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import NewEspressoDialog from './new-esspresso-dialog/new-espresso-dialog.component';

@Component({
  selector: 'app-espressos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  template: `
    <section style="padding: 16px;">
      <h2>Espressos</h2>

      @if (loading) {
        <div style="display:flex;  justify-content:center;padding:24px;">
          <div style="display:flex;  flex-direction:column; align-items:center;">
            <mat-progress-spinner mode="indeterminate">Test</mat-progress-spinner>
            <p>Extracting Espressos...</p>
          </div>
        </div>
      } @else {
        <div class="grid">
          @for (e of espressosList; track e.id) {
            <mat-card class="espresso-card">
              <mat-card-title>{{ e.name || 'Unnamed' }}</mat-card-title>
              <mat-card-subtitle>von {{ e.vendor || "" }}</mat-card-subtitle>
              <mat-card-content>
                <div class="espresso-row">
                  Rezept:
                </div>
                <div class="espresso-row">
                  <mat-icon class="espresso-icon">scale</mat-icon>
                  <span class="espresso-value">{{ e.gramms }}g</span>
                  <mat-icon class="espresso-icon">timer</mat-icon>
                  <span class="espresso-value">{{ e.runtime }}s</span>
                  <mat-icon class="espresso-icon">output</mat-icon>
                  <span class="espresso-value">{{ e.gramms * e.ratio }}g</span>
                </div>
              </mat-card-content>
            </mat-card>
          }
          <mat-card class="espresso-card" (click)="createNewCoffee()">
            <mat-card-title>Neuer Espresso</mat-card-title>
            <mat-card-content>
              <div class="new-espresso">
                <mat-icon class="new-icon">add2</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      }

      @if (!loading && espressosList.length === 0) {
        <p>No espressos found.</p>
      }
    </section>
  `,
  styles: [
    `
      .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;
        justify-content: center;
      }

      .espresso-card {
        flex: 1 1 calc(100% - 12px);
        min-width: 220px;
        max-width: 400px;
        min-height: 120px;
        box-sizing: border-box;
        margin: 0 auto;
      }

      .mat-card-title {
        margin-bottom: 4px;
        margin-top: 8px;
      }

      .mat-card-subtitle {
        margin-bottom: 15px;
        margin-left: 2px;
      }

      .espresso-row {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-bottom: 8px;
        margin-top: 8px;
      }

      .espresso-icon {
        font-size: 20px;
        vertical-align: middle;
        color: var(--mat-sys-on-surface, #666);
      }

      .espresso-value {
        min-width: 32px;
        font-size: 1.05em;
        font-weight: 500;
        margin-right: 8px;
      }

      .new-icon {
        vertical-align: center;
      }

      @media (min-width: 600px) {
        .espresso-card {
          flex: 1 1 calc(50% - 12px);
        }
      }

      @media (min-width: 900px) {
        .espresso-card {
          flex: 1 1 calc(33% - 12px);
        }
      }

      section {
        padding: 8px;
      }

      new-espresso{
        align-content: center;
      }

      @media (max-width: 600px) {
        section {
          padding: 4px;
        }

        .espresso-card {
          min-width: 0;
          max-width: 100vw;
        }
      }
    `
  ]
})
export class EspressosComponent implements OnInit {
  espressosList: any[] = [];
  loading = true;
  readonly dialog = inject(MatDialog);

 async createNewCoffee(): Promise<void> {
    this.dialog.open(NewEspressoDialog, {
      width: '250px',
    }).afterClosed().subscribe( async () => {
      await this.extractEspressos();
    });
  }


  constructor(private backend: SupabaseEspressos, private cdr: ChangeDetectorRef) {
  }

  async ngOnInit(): Promise<void> {
    await this.extractEspressos();
  }

  async extractEspressos(): Promise<void> {
    try {
      this.loading = true;
      const rows = await this.backend.getEspressos();
      this.espressosList = rows ?? [];

      console.log(this.espressosList);
    } catch (err) {
      console.error('Failed to load espressos', err);
      this.espressosList = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
