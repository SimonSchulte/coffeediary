import {Component} from '@angular/core';

import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SupabaseEspressos} from '../../backend/supabase.espressos';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-espresso-dialog',
  imports: [
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose, MatIconModule, FormsModule, ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Neuer Yummi ☕</h2>
    <mat-dialog-content>
      <mat-form-field class="new-espresso-formfield">
        <mat-label>Name</mat-label>
        <input matInput required [(ngModel)]="espresso_name">
      </mat-form-field>

      <mat-form-field class="new-espresso-formfield">
        <mat-label>Röster</mat-label>
        <input matInput required [(ngModel)]="espresso_vendor">
      </mat-form-field>

      <h3 mat-dialog-content>Rezept</h3>

      <mat-form-field class="new-espresso-formfield">
        <mat-label>Mahlgrad</mat-label>
        <input matInput type="number" required [(ngModel)]="espresso_grinder_setting">
      </mat-form-field>

      <mat-form-field class="new-espresso-formfield">
        <mat-label>
          <mat-icon>timer</mat-icon>
          Zeit
        </mat-label>
        <input matInput type="number" required [defaultValue]="25" [(ngModel)]="espresso_timer">
      </mat-form-field>

      <mat-form-field class="new-espresso-formfield" floatLabel="always">
        <mat-label>
          <mat-icon>scale</mat-icon>
          Gramm
        </mat-label>
        <input matInput type="number" required [defaultValue]="18" [(ngModel)]="espresso_gramms">
      </mat-form-field>


      <mat-form-field class="new-espresso-formfield" floatLabel="always">
        <input matInput type="number" required [defaultValue]="2" [(ngModel)]="espresso_ratio">
        <mat-label>
          <mat-icon></mat-icon>
          Ratio
        </mat-label>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button matButton mat-dialog-close>Abbrechen</button>
      <button matButton mat-dialog-close cdkFocusInitial (click)="addEspresso()">Speichern</button>
    </mat-dialog-actions>

  `,
  styles: [
    `
      .new-espresso-formfield {
        margin: 1em;
      }
    `
  ],
})
class NewEspressoDialog {
  protected espresso_name: any;
  protected espresso_ratio: any;
  protected espresso_gramms: any;
  protected espresso_timer: any;
  protected espresso_grinder_setting: any;
  protected espresso_vendor: any;

  constructor(protected supabaseEspressos: SupabaseEspressos, protected snackBar: MatSnackBar) {
  }

  protected addEspresso() {
    this.supabaseEspressos.addEspresso({
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
