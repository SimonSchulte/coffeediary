import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {ActivatedRoute} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-extraction-overview',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCardModule, MatIconModule],
  template: `
    <mat-card>
      <h2>Bezüge Übersicht</h2>
      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z2">
        <!-- Datum Column -->
        <ng-container matColumnDef="created_at">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            <mat-icon>calendar_today</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.created_at | date:'dd.MM.yy'  }}</td>
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
          <td mat-cell *matCellDef="let element">{{ element.ratio || '1:2' }}</td>
        </ng-container>
        <!-- Output Column -->
        <ng-container matColumnDef="output">
          <th mat-header-cell *matHeaderCellDef>
            <mat-icon>output</mat-icon>
          </th>
          <td mat-cell *matCellDef="let element">{{ element.output }}g</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [pageSize]="10"></mat-paginator>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        margin: 24px;
        padding: 16px;
      }

      table {
        width: 100%;
        margin-bottom: 16px;
        max-width: 100%;
        box-sizing: border-box;
        display: block;
        overflow-x: auto;
      }

      .mat-elevation-z2 {
        width: 100%;
        box-sizing: border-box;
      }

      th, td {
        word-break: break-word;
      }

      th.mat-header-cell, td.mat-cell {
        white-space: nowrap;
      }

      th.mat-header-cell.created_at, td.mat-cell.created_at {
        min-width: 120px;
        max-width: 180px;
      }

      th.mat-header-cell.output, td.mat-cell.output {
        min-width: 80px;
        max-width: 120px;
      }
    `
  ]
})
export class ExtractionOverviewComponent implements OnInit {
  displayedColumns: string[] = ['created_at', 'grinder_setting', 'gramms', 'runtime', 'ratio', 'output'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private espressos: SupabaseEspressosService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
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
}
