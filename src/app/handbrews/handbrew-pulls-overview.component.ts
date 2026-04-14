import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {SupabaseHandbrewsService} from '../backend/supabase.handbrews.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {HandbrewPull, HANDBREW_RECIPES} from '../models/handbrew';

@Component({
  selector: 'app-handbrew-pulls-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatIconButton,
    MatButtonModule,
  ],
  template: `
    <mat-card appearance="outlined" class="pulls-card">
      <div class="pulls-header">
        <button mat-icon-button (click)="goBack()" aria-label="Zurück">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2>Aufgüsse</h2>
      </div>
      <div class="table-scroll">
        <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0 pulls-table">
          <!-- Datum Column -->
          <ng-container matColumnDef="created_at">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              <mat-icon>calendar_today</mat-icon>
            </th>
            <td mat-cell *matCellDef="let element">{{ element.created_at | date:'dd.MM.yy' }}</td>
          </ng-container>
          <!-- Rezept Column -->
          <ng-container matColumnDef="recipe_key">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon>menu_book</mat-icon>
            </th>
            <td mat-cell *matCellDef="let element">{{ recipeLabel(element.recipe_key) }}</td>
          </ng-container>
          <!-- Mahlgrad Column -->
          <ng-container matColumnDef="grinder_setting">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon>settings</mat-icon>
            </th>
            <td mat-cell *matCellDef="let element">{{ element.grinder_setting }}</td>
          </ng-container>
          <!-- Aufgüsse Column -->
          <ng-container matColumnDef="infusions">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon>format_list_numbered</mat-icon>
            </th>
            <td mat-cell *matCellDef="let element">{{ element.infusions }}</td>
          </ng-container>
          <!-- Aufgussmenge Column -->
          <ng-container matColumnDef="infusion_ml">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon>water_drop</mat-icon>
            </th>
            <td mat-cell *matCellDef="let element">{{ element.infusion_ml }} ml</td>
          </ng-container>
          <!-- Output Column -->
          <ng-container matColumnDef="output_ml">
            <th mat-header-cell *matHeaderCellDef>
              <mat-icon>output</mat-icon>
            </th>
            <td mat-cell *matCellDef="let element">{{ element.output_ml }} ml</td>
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
      .pulls-card {
        margin: 16px;
        padding: 16px;
        background: var(--mat-sys-surface-container-low);
      }

      @media (min-width: 600px) {
        .pulls-card {
          margin: 24px auto;
          max-width: 960px;
        }
      }

      .pulls-header {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: -8px 0 8px -8px;
      }

      .pulls-header h2 {
        margin: 0;
      }

      .table-scroll {
        width: 100%;
        overflow-x: auto;
        margin-bottom: 12px;
        mask-image: linear-gradient(to right, black 0%, black 92%, transparent 100%);
        -webkit-mask-image: linear-gradient(to right, black 0%, black 92%, transparent 100%);
      }

      .pulls-table {
        width: 100%;
        background: transparent;
        font-variant-numeric: tabular-nums;
        font-size: 0.85rem;
      }

      .pulls-table .mat-mdc-header-cell {
        color: var(--mat-sys-on-surface-variant);
      }

      .pulls-table .mat-mdc-header-cell mat-icon {
        color: var(--mat-sys-tertiary);
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .pulls-table th,
      .pulls-table td {
        white-space: nowrap;
        border-bottom-color: var(--mat-sys-outline-variant);
      }
    `,
  ],
})
export class HandbrewPullsOverviewComponent implements OnInit {
  displayedColumns: string[] = ['created_at', 'recipe_key', 'grinder_setting', 'infusions', 'infusion_ml', 'output_ml'];
  dataSource = new MatTableDataSource<HandbrewPull>([]);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private handbrews: SupabaseHandbrewsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  goBack(): void {
    this.router.navigate(['/handbrews']);
  }

  recipeLabel(key: string): string {
    return HANDBREW_RECIPES.find((r) => r.key === key)?.label ?? key;
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const handbrewId = params['handbrewId'];
      const pulls = await this.handbrews.getAllPulls(handbrewId);
      this.dataSource.data = pulls;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
    });
  }
}
