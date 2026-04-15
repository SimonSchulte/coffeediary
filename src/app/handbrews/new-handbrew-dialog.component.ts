import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SupabaseHandbrewsService} from '../backend/supabase.handbrews.service';
import {SnackBarService} from '../services/snack-bar.service';

@Component({
  selector: 'app-new-handbrew-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  template: `
    <h2 mat-dialog-title>Neuer Handbrew</h2>
    <mat-dialog-content class="cd-dialog-content">
      <mat-form-field class="handbrew-formfield" appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput required [(ngModel)]="name" autocomplete="off">
      </mat-form-field>

      <mat-form-field class="handbrew-formfield" appearance="outline">
        <mat-label>Rösterei</mat-label>
        <input matInput required [(ngModel)]="vendor" autocomplete="off">
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button matButton mat-dialog-close>Abbrechen</button>
      <button
        matButton="filled"
        color="primary"
        mat-dialog-close
        [disabled]="!name.trim() || !vendor.trim()"
        (click)="save()">
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

      .handbrew-formfield {
        width: 100%;
      }
    `,
  ],
})
export default class NewHandbrewDialogComponent {
  protected name = '';
  protected vendor = '';

  private readonly handbrews = inject(SupabaseHandbrewsService);
  private readonly snackBar = inject(SnackBarService);

  protected save(): void {
    if (!this.name.trim() || !this.vendor.trim()) return;
    this.handbrews
      .create({name: this.name.trim(), vendor: this.vendor.trim(), archived: false})
      .then(() => this.snackBar.open('Handbrew hinzugefügt!'));
  }
}
