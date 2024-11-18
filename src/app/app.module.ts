import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { ChangeManagerDialogComponent } from './change-manager-dialog/change-manager-dialog.component';
import { AddSubordinateDialogComponent } from './add-subordinate-dialog/add-subordinate-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RemoveDialogComponent,
    ChangeManagerDialogComponent,
    AddSubordinateDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { exitAnimationDuration: 250, disableClose: true, maxWidth: '80vw' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
