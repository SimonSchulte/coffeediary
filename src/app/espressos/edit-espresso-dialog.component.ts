import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SupabaseEspressosService} from '../backend/supabase.espressos.service';

export interface EditEspressoDialogData {
  id: number;
  name: string;
  vendor: string;
}

@Component({
  selector: 'app-edit-espresso-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
  ],
  template: `
    <h2 mat-dialog-title>Espresso umbenennen</h2>
    <mat-dialog-content class="cd-dialog-content">
      <mat-form-field class="espresso-formfield" appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput required [(ngModel)]="name" autocomplete="off">
      </mat-form-field>

      <mat-form-field class="espresso-formfield" appearance="outline">
        <mat-label>Röster</mat-label>
        <input matInput required [(ngModel)]="vendor" autocomplete="off">
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button matButton (click)="dialogRef.close()">Abbrechen</button>
      <button matButton="filled" color="primary" [disabled]="!name.trim() || !vendor.trim()" (click)="save()">
        Speichern
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .cd-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 8px;
    }
  `],
})
export default class EditEspressoDialogComponent {
  protected name: string;
  protected vendor: string;

  readonly dialogRef = inject(MatDialogRef<EditEspressoDialogComponent>);
  private readonly data = inject<EditEspressoDialogData>(MAT_DIALOG_DATA);
  private readonly supabaseEspressos = inject(SupabaseEspressosService);

  constructor() {
    this.name = this.data.name;
    this.vendor = this.data.vendor;
  }

  protected async save(): Promise<void> {
    if (!this.name.trim() || !this.vendor.trim()) return;
    await this.supabaseEspressos.update(this.data.id, {name: this.name.trim(), vendor: this.vendor.trim()});
    this.dialogRef.close(true);
  }
}
