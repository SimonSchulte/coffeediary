import {Component, OnInit, ChangeDetectorRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';

import {
  MatDialog
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import NewEspressoDialog from './new-espresso-dialog.component';
import NewExtractionDialogComponent from './new-extraction-dialog.component';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-espressos',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule, MatExpansionModule, MatTableModule],
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
        <mat-accordion class="espresso-accordion">
          @for (e of espressosList; track e.id) {
            <mat-expansion-panel class="espresso" (opened)="onPanelOpened(e.id)" (closed)="onPanelClosed(e.id)">
              <mat-expansion-panel-header>
                <mat-panel-title>{{ e.name }}</mat-panel-title>
                <mat-panel-description>
                  {{ e.vendor }}
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
                  <!-- Icon Column -->
                  <ng-container matColumnDef="icon">
                    <td mat-cell *matCellDef="let element">
                      <mat-icon class="espresso-icon">{{ element.icon }}</mat-icon>
                    </td>
                  </ng-container>
                  <!-- Description Column (empty for now) -->
                  <ng-container matColumnDef="desc">
                    <td mat-cell *matCellDef="let element">
                      {{ element.desc }}
                    </td>
                  </ng-container>
                  <!-- Value Column -->
                  <ng-container matColumnDef="value">
                    <td mat-cell *matCellDef="let element">
                      <span class="espresso-value">{{ element.value }}</span>
                    </td>
                  </ng-container>
                  <tr mat-row *matRowDef="let row; columns: ['icon', 'desc', 'value'];"></tr>
                </table>

                <button mat-flat-button color="primary" class="extraction-div" (click)="openExtractionDialog(e)">Bezug erfassen</button>
                <button mat-stroked-button color="accent" class="extraction-div" (click)="goToExtractions(e)"> {{e.espresso_pulls?.length || 0}} Bezüge</button>
              </div>

            </mat-expansion-panel>
          }
        </mat-accordion>
        <div class="grid">
          <mat-card class="espresso-card new-espresso-card" (click)="createNewCoffee()">
            <mat-card-title class="new-espresso-title">Neuer Espresso</mat-card-title>
            <mat-card-content>
              <div class="new-espresso-content">
                <mat-icon class="new-icon">add</mat-icon>
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
      .espresso-accordion {
        width: 100%;
      }

      .espresso {
        margin-bottom: 4px;
      }

      .mat-expansion-panel-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .espresso-card {
        margin-bottom: 16px;
        padding-bottom: 8px;
        width: 100%;
      }

      .espresso-header {
        padding-left: 16px;
        margin-bottom: 0;
      }

      .espresso-subheader {
        padding-left: 16px;
        margin-bottom: 8px;
      }

      .espresso-inner-accordion {
        width: 98%;
        box-shadow: none;
        background: transparent;
        margin: 8px 0px 4px 4px;
      }

      .espresso-accordion-header {
        width: 100%;
        padding-left: 16px;
      }

      .espresso-row {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-bottom: 8px;
        margin-top: 8px;
      }

      .espresso-value {
        min-width: 32px;
        font-size: 1.05em;
        font-weight: 500;
        margin-right: 8px;
      }

      .espresso-details {
        padding: 16px;
        background: #f7f7f7;
        border-radius: 4px;
      }

      .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;
        justify-content: center;
      }

      .espresso-card.new-espresso-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: box-shadow 0.2s, transform 0.2s;
        border: 2px dashed #bdbdbd;
        background: #f7f7f7;
      }

      .new-espresso-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: scale(1.03);
        border-color: #1976d2;
        background: #e3f2fd;
      }

      .new-espresso-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .new-icon {
        font-size: 56px;
        color: #1976d2;
        margin-bottom: 8px;
        transition: color 0.2s;
        display: block;
      }

      .new-espresso-title {
        text-align: center;
        font-weight: 600;
        font-size: 1.2em;
        margin-bottom: 0;
        margin-top: 12px;
        color: #1976d2;
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

      new-espresso {
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

      .known-extraction-div {
        align-items: center;
      }


      .extraction-div {
        margin-top: 16px;
        width: 100%;
        display: block;
      }
    `
  ]
})
export class EspressosComponent implements OnInit {
  espressosList: any[] = [];
  loading = true;
  readonly dialog = inject(MatDialog);
  expanded: { [id: number]: boolean } = {};

 async createNewCoffee(): Promise<void> {
    this.dialog.open(NewEspressoDialog, {
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

  openExtractionDialog(e: any) {
    this.dialog.open(NewExtractionDialogComponent, {
      data: { grinder_setting: e.grinder_setting },
    });
  }

  goToExtractions(e: any) {
    // Navigiert zur ExtractionOverview-Seite mit Espresso-ID als Parameter
    this.router.navigate(['/extractions'], { queryParams: { espressoId: e.id } });
  }
}
