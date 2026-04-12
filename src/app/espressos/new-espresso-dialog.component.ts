import {Component} from '@angular/core';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-new-espresso-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  template: `
    <h2 mat-dialog-title>Neuer Yummi ☕</h2>
    <mat-dialog-content class="cd-dialog-content">
      <mat-form-field class="espresso-formfield" appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput required [(ngModel)]="espresso_name" autocomplete="off">
      </mat-form-field>

      <mat-form-field class="espresso-formfield" appearance="outline">
        <mat-label>Röster</mat-label>
        <input matInput required [(ngModel)]="espresso_vendor" autocomplete="off">
      </mat-form-field>

      <mat-accordion class="receipe-accordion">
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>Rezeptdetails</mat-panel-title>
          </mat-expansion-panel-header>

          <mat-form-field class="espresso-formfield" appearance="outline">
            <mat-label>Mahlgrad</mat-label>
            <input matInput type="number" inputmode="decimal" required [(ngModel)]="espresso_grinder_setting">
            <mat-icon matSuffix>settings</mat-icon>
          </mat-form-field>

          <mat-form-field class="espresso-formfield" appearance="outline">
            <mat-label>Zeit (s)</mat-label>
            <input matInput type="number" inputmode="numeric" required [defaultValue]="25" [(ngModel)]="espresso_timer">
            <mat-icon matSuffix>timer</mat-icon>
          </mat-form-field>

          <mat-form-field class="espresso-formfield" appearance="outline" floatLabel="always">
            <mat-label>Gramm</mat-label>
            <input matInput type="number" inputmode="decimal" required [defaultValue]="18" [(ngModel)]="espresso_gramms">
            <mat-icon matSuffix>scale</mat-icon>
          </mat-form-field>

          <mat-form-field class="espresso-formfield" appearance="outline" floatLabel="always">
            <mat-label>Ratio</mat-label>
            <input matInput type="number" inputmode="decimal" required [defaultValue]="2" [(ngModel)]="espresso_ratio">
            <mat-icon matSuffix>linear_scale</mat-icon>
          </mat-form-field>
        </mat-expansion-panel>
      </mat-accordion>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Abbrechen</button>
      <button matButton="filled" color="primary" mat-dialog-close cdkFocusInitial (click)="addEspresso()">
        <mat-icon>check</mat-icon>
        Speichern
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .cd-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-top: 8px;
      }

      .receipe-accordion {
        width: 100%;
        margin-top: 8px;
      }
    `
  ],
  standalone: true
})
class NewEspressoDialog {
  protected espresso_name = '';
  protected espresso_vendor = '';
  protected espresso_ratio: number | null = 2;
  protected espresso_gramms: number | null = 18;
  protected espresso_timer: number | null = 25;
  protected espresso_grinder_setting: number | null = null;

  constructor(protected supabaseEspressos: SupabaseEspressosService, protected snackBar: MatSnackBar) {
  }

  protected addEspresso(): void {
    if (
      this.espresso_ratio == null ||
      this.espresso_gramms == null ||
      this.espresso_timer == null ||
      this.espresso_grinder_setting == null
    ) {
      return;
    }
    this.supabaseEspressos
      .create({
        name: this.espresso_name,
        vendor: this.espresso_vendor,
        grinder_setting: this.espresso_grinder_setting,
        ratio: this.espresso_ratio,
        runtime: this.espresso_timer,
        gramms: this.espresso_gramms,
      })
      .then(() => this.snackBar.open('Espresso hinzugefügt!', 'OK', {duration: 3000}));
  }
}

export default NewEspressoDialog
