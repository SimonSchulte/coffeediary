import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SnackBarService} from '../services/snack-bar.service';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {EspressoPull} from '../models/espresso';

@Component({
  selector: 'app-extraction-overview',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule, MatIconModule, MatIconButton, MatButtonModule],
  template: `
    <mat-card appearance="outlined" class="extraction-card">
      <div class="extraction-header">
        <button mat-icon-button (click)="goBack()" aria-label="Zurück">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Bezüge</h2>
      </div>
      <div class="table-scroll">
      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0 extraction-table">
        <!-- Datum Column -->
        <ng-container matColumnDef="created_at">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            <mat-icon>calendar_today</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.created_at | date:'dd.MM.yy' }}</td>
        </ng-container>
        <!-- Mahlgrad Column -->
        <ng-container matColumnDef="grinder_setting">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>settings</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.grinder_setting }}</td>
        </ng-container>
        <!-- Bohnen Column -->
        <ng-container matColumnDef="gramms">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>scale</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.gramms }}</td>
        </ng-container>
        <!-- Bezug Column -->
        <ng-container matColumnDef="runtime">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>timer</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.runtime }}</td>
        </ng-container>
        <!-- Ratio Column -->
        <ng-container matColumnDef="ratio">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>double_arrow</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element"> 1:{{ (element.output / element.gramms) | number:'1.2-2' }}</td>
          >
        </ng-container>
        <!-- Output Column -->
        <ng-container matColumnDef="output">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>output</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.output }}g</td>
        </ng-container>
        <!-- Publish Column -->
        <ng-container matColumnDef="publish">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>publish</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button (click)="publishExtraction(element)" aria-label="Als Standardrezept übernehmen">
              <mat-icon>publish</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      </div>
      <mat-paginator [pageSize]="15" [hidePageSize]="true"></mat-paginator>
    </mat-card>
  `,
  styles: [
    `
      .extraction-card {
        margin: 16px;
        padding: 16px;
        background: var(--mat-sys-surface-container-low);
      }

      @media (min-width: 600px) {
        .extraction-card {
          margin: 24px auto;
          max-width: 960px;
        }
      }

      .extraction-header {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: -8px 0 8px -8px;
      }

      .extraction-header h2 {
        margin: 0;
      }

      .table-scroll {
        width: 100%;
        overflow-x: auto;
        margin-bottom: 12px;
        mask-image: linear-gradient(to right, black 0%, black 92%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 0%, black 92%, transparent 100%);
      }

      .extraction-table {
        width: 100%;
        background: transparent;
        font-variant-numeric: tabular-nums;
        font-size: 0.85rem;
      }

      .extraction-table .mat-mdc-header-cell {
        color: var(--mat-sys-on-surface-variant);
      }

      .extraction-table .mat-mdc-header-cell mat-icon {
        color: var(--mat-sys-tertiary);
      }

      .extraction-table th,
      .extraction-table td {
        white-space: nowrap;
        border-bottom-color: var(--mat-sys-outline-variant);
      }

      .extraction-table th.mat-mdc-header-cell.created_at,
      .extraction-table td.mat-mdc-cell.created_at {
        min-width: 110px;
      }
    `
  ]
})
export class ExtractionOverviewComponent implements OnInit {
  displayedColumns: string[] = ['created_at', 'grinder_setting', 'gramms', 'runtime', 'ratio', 'output', 'publish'];
  dataSource = new MatTableDataSource<EspressoPull>([]);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private espressos: SupabaseEspressosService,
              private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private snackBar: SnackBarService) {
  }

  goBack(): void {
    this.router.navigate(['/espressos']);
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const espressoId = params['espressoId'];
      const extractions = await this.espressos.getAllExtractions(espressoId);
      this.dataSource.data = extractions;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
    });
  }

  async publishExtraction(element: EspressoPull): Promise<void> {
    try {
      await this.espressos.updateDefaultRecipe(element.espresso_id, {
        gramms: element.gramms,
        ratio: element.output / element.gramms,
        grinder_setting: element.grinder_setting,
        runtime: element.runtime,
      });
      this.snackBar.open('Espresso erfolgreich aktualisiert!');
    } catch (err) {
      this.snackBar.open('Fehler beim Aktualisieren des Espressos!');
    }
  }
}
