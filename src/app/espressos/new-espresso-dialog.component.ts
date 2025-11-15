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
    <mat-dialog-content>
      <mat-form-field class="espresso-formfield">
        <mat-label>Name</mat-label>
        <input matInput required [(ngModel)]="espresso_name">
      </mat-form-field>

      <mat-form-field class="espresso-formfield">
        <mat-label>Röster</mat-label>
        <input matInput required [(ngModel)]="espresso_vendor">
      </mat-form-field>

      <mat-accordion class="receipe-accordion">
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>Rezeptdetails</mat-panel-title>
          </mat-expansion-panel-header>
          <mat-form-field class="espresso-formfield">
            <mat-label>Mahlgrad</mat-label>
            <input matInput type="number" required [(ngModel)]="espresso_grinder_setting">
          </mat-form-field>

          <mat-form-field class="espresso-formfield">
            <mat-label>
              <mat-icon>timer</mat-icon>
              Zeit
            </mat-label>
            <input matInput type="number" required [defaultValue]="25" [(ngModel)]="espresso_timer">
          </mat-form-field>

          <mat-form-field class="espresso-formfield" floatLabel="always">
            <mat-label>
              <mat-icon>scale</mat-icon>
              Gramm
            </mat-label>
            <input matInput type="number" required [defaultValue]="18" [(ngModel)]="espresso_gramms">
          </mat-form-field>

          <mat-form-field class="espresso-formfield" floatLabel="always">
            <input matInput type="number" required [defaultValue]="2" [(ngModel)]="espresso_ratio">
            <mat-label>
              <mat-icon>linear_scale</mat-icon>
              Ratio
            </mat-label>
          </mat-form-field>
        </mat-expansion-panel>
      </mat-accordion>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button matButton mat-dialog-close>Abbrechen</button>
      <button matButton mat-dialog-close cdkFocusInitial (click)="addEspresso()">Speichern</button>
    </mat-dialog-actions>

  `,
  styles: [
    `
      .receipe-accordion {
        width: 95%;
      }
    `
  ],
  standalone: true
})
class NewEspressoDialog {
  protected espresso_name: any;
  protected espresso_ratio: any;
  protected espresso_gramms: any;
  protected espresso_timer: any;
  protected espresso_grinder_setting: any;
  protected espresso_vendor: any;

  constructor(protected supabaseEspressos: SupabaseEspressosService, protected snackBar: MatSnackBar) {
  }

  protected addEspresso() {
    this.supabaseEspressos.create({
        name: this.espresso_name,
        vendor: this.espresso_vendor,
        grinder_setting: this.espresso_grinder_setting,
        ratio: this.espresso_ratio,
        runtime: this.espresso_timer,
        gramms: this.espresso_gramms
      }
    ).then(r => this.snackBar.open('Espresso hinzugefügt!', 'OK', {duration: 3000}));
  }
}

export default NewEspressoDialog
