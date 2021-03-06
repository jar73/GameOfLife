import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RatingComponent } from './rating/rating.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { FlexModule } from '@angular/flex-layout';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

const MATERIAL = [
  MatBadgeModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatListModule,
  MatSliderModule,
  MatIconModule,
  MatButtonModule,
  MatSnackBarModule,
  MatOptionModule,
  MatToolbarModule,
  MatMenuModule,
  MatDialogModule,
  MatTableModule,
  MatSelectModule,
  MatTooltipModule,
  MatGridListModule,
  MatRippleModule,
  MatStepperModule,
  ReactiveFormsModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatToolbarModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatTooltipModule,
  MatChipsModule,
  MatSortModule,
  MatPaginatorModule,
];

@NgModule({
  declarations: [RatingComponent],
  imports: [CommonModule, PasswordStrengthMeterModule, ...MATERIAL, FlexModule],
  exports: [CommonModule, RouterModule, FormsModule, ...MATERIAL, RatingComponent, FlexModule],
})
export class SharedModule {}
