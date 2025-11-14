import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppToolbar } from './ui/app-toolbar.component';
import { AppFooter } from './ui/app-footer.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppToolbar, AppFooter, MatSnackBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('coffeediary');
}
