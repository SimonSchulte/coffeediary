import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {SupabaseHandbrewsService} from '../backend/supabase.handbrews.service';
import {SnackBarService} from '../services/snack-bar.service';
import {HANDBREW_RECIPES, HandbrewRecipeDefinition} from '../models/handbrew';

export interface NewHandbrewPullDialogData {
  handbrewId: number;
}

@Component({
  selector: 'app-new-handbrew-pull-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  template: `
    <h2 mat-dialog-title>Aufguss erfassen</h2>
    <mat-dialog-content class="cd-dialog-content">
      <form #pullForm="ngForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="handbrew-formfield" appearance="outline">
          <mat-label>Rezept</mat-label>
          <mat-select name="recipe" [(ngModel)]="selectedRecipe" required (ngModelChange)="onRecipeChange($event)">
            @for (r of recipes; track r.key) {
              <mat-option [value]="r">{{ r.label }}</mat-option>
            }
          </mat-select>
          <mat-icon matSuffix>menu_book</mat-icon>
        </mat-form-field>

        @if (selectedRecipe) {
          <div class="recipe-preview">
            <mat-icon>water_drop</mat-icon>
            <span>{{ selectedRecipe.beans_g }} g Bohnen → {{ selectedRecipe.output_ml }} ml Output</span>
          </div>
        }

        <div class="field-row">
          <mat-form-field class="handbrew-formfield" appearance="outline">
            <mat-label>Mahlgrad</mat-label>
            <input matInput type="number" inputmode="decimal" name="grinder_setting" [(ngModel)]="grinder_setting" required>
            <mat-icon matSuffix>settings</mat-icon>
          </mat-form-field>
          <mat-form-field class="handbrew-formfield" appearance="outline">
            <mat-label>Aufgüsse</mat-label>
            <input matInput type="number" inputmode="numeric" name="infusions" [(ngModel)]="infusions" required placeholder="3">
            <mat-icon matSuffix>format_list_numbered</mat-icon>
          </mat-form-field>
        </div>

        <mat-form-field class="handbrew-formfield" appearance="outline">
          <mat-label>Aufgussmenge (ml)</mat-label>
          <input matInput type="number" inputmode="decimal" name="infusion_ml" [(ngModel)]="infusion_ml" required placeholder="100">
          <mat-icon matSuffix>water_drop</mat-icon>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()">Abbrechen</button>
      <button
        mat-flat-button
        color="primary"
        type="submit"
        [disabled]="!pullForm.form.valid"
        (click)="onSubmit()">
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
        padding-top: 8px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .handbrew-formfield {
        width: 100%;
      }

      .field-row {
        display: flex;
        gap: 12px;
      }

      .field-row .handbrew-formfield {
        flex: 1;
        min-width: 0;
      }

      .recipe-preview {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 10px;
        font-weight: 600;
        font-size: 0.95rem;
        font-variant-numeric: tabular-nums;
        margin-bottom: 4px;
        background: color-mix(in srgb, var(--mat-sys-tertiary) 12%, transparent);
        color: var(--mat-sys-tertiary);
      }

      .recipe-preview mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export default class NewHandbrewPullDialogComponent {
  readonly recipes = HANDBREW_RECIPES;

  selectedRecipe: HandbrewRecipeDefinition | null = null;
  grinder_setting: number | null = null;
  infusions: number | null = null;
  infusion_ml: number | null = null;

  private readonly dialogRef = inject(MatDialogRef<NewHandbrewPullDialogComponent>);
  private readonly data = inject<NewHandbrewPullDialogData>(MAT_DIALOG_DATA);
  private readonly handbrews = inject(SupabaseHandbrewsService);
  private readonly snackBar = inject(SnackBarService);

  onRecipeChange(recipe: HandbrewRecipeDefinition): void {
    this.selectedRecipe = recipe;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (
      this.selectedRecipe == null ||
      this.grinder_setting == null ||
      this.infusions == null ||
      this.infusion_ml == null
    ) {
      this.snackBar.open('Bitte alle Felder ausfüllen!');
      return;
    }
    try {
      await this.handbrews.createHandbrewPull({
        handbrew_id: this.data.handbrewId,
        recipe_key: this.selectedRecipe.key,
        grinder_setting: this.grinder_setting,
        beans_g: this.selectedRecipe.beans_g,
        infusions: this.infusions,
        infusion_ml: this.infusion_ml,
        output_ml: this.selectedRecipe.output_ml,
      });
      this.snackBar.open('Aufguss gespeichert!');
      this.dialogRef.close(true);
    } catch {
      this.snackBar.open('Fehler beim Speichern des Aufgusses.');
    }
  }
}
