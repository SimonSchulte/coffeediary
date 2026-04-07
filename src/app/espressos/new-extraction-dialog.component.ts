import {Component, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatDialogActions, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';
import {SnackBarService} from '../services/snack-bar.service';
import {Espresso} from '../models/espresso';

export interface NewExtractionDialogData {
  espressoId: number;
  grinder_setting: Espresso['grinder_setting'];
  gramms: Espresso['gramms'];
}

export interface NewExtractionDialogResult {
  runtime: number;
  output: number;
  grinder_setting: number;
}

@Component({
  selector: 'app-new-extraction-dialog',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogContent, MatDialogActions],
  template: `
    <h2 mat-dialog-title style="margin-left: 16px">Bezug erfassen - Wie lief's?</h2>
    <mat-dialog-content>
      <form #extractionForm="ngForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="espresso-formfield" appearance="fill">
          <mat-label>Bezug (Sekunden)</mat-label>
          <input matInput type="number" name="runtime" [(ngModel)]="runtime" required>
        </mat-form-field>
        <mat-form-field class="espresso-formfield" appearance="fill">
          <mat-label>Output (g)</mat-label>
          <input matInput type="number" name="output" [(ngModel)]="output" required>
        </mat-form-field>
        <mat-form-field class="espresso-formfield" appearance="fill">
          <mat-label>Mahlgrad</mat-label>
          <input matInput type="number" name="grinder_setting" [(ngModel)]="grinder_setting" required>
        </mat-form-field>
        <mat-form-field class="espresso-formfield" appearance="fill">
          <mat-label>Bohnen (g)</mat-label>
          <input matInput type="number" name="gramms" [(ngModel)]="gramms" required>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button type="button" (click)="onCancel()">Abbrechen</button>
      <button mat-flat-button color="primary" type="submit" [disabled]="!extractionForm.form.valid" (click)="onSubmit()">Speichern
      </button>
    </mat-dialog-actions>

  `
})
export default class NewExtractionDialogComponent {
  runtime: number | null = null;
  output: number | null = null;
  grinder_setting: number | null;
  gramms: number | null;
  espressoId: number;

  constructor(
    private dialogRef: MatDialogRef<NewExtractionDialogComponent, NewExtractionDialogResult>,
    private supabaseEspressosService: SupabaseEspressosService,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: NewExtractionDialogData
  ) {
    this.espressoId = data.espressoId;
    this.grinder_setting = data.grinder_setting;
    this.gramms = data.gramms;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (
      this.runtime == null ||
      this.output == null ||
      this.grinder_setting == null ||
      this.gramms == null
    ) {
      this.snackBarService.open('Bitte alle Felder ausfüllen!');
      return;
    }
    try {
      await this.supabaseEspressosService.createEspressoPull({
        espresso_id: this.espressoId,
        runtime: this.runtime,
        output: this.output,
        grinder_setting: this.grinder_setting,
        gramms: this.gramms,
      });
      this.snackBarService.open('Neuer Bezug erfolgreich gespeichert!');
      this.dialogRef.close({
        runtime: this.runtime,
        output: this.output,
        grinder_setting: this.grinder_setting,
      });
    } catch (error) {
      this.snackBarService.open('Fehler beim Speichern des Bezugs');
    }
  }
}
