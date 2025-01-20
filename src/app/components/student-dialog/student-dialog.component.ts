import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.isEdit ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle' }}
    </h2>
    <div class="dialog-content">
      <form [formGroup]="studentForm">
        <mat-form-field appearance="outline">
          <mat-label>Ad</mat-label>
          <input matInput formControlName="first_name" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Soyad</mat-label>
          <input matInput formControlName="last_name" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sınıf</mat-label>
          <input matInput formControlName="class_name" required />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Veli Telefon</mat-label>
          <input matInput formControlName="parent_phone" />
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">İptal</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="!studentForm.valid"
      >
        {{ data.isEdit ? 'Güncelle' : 'Kaydet' }}
      </button>
    </div>
  `,
  styles: [
    `
      .dialog-content {
        padding: 20px 0;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      mat-form-field {
        width: 100%;
      }
      mat-dialog-actions {
        padding: 16px 0;
        margin-bottom: 0;
      }
    `,
  ],
})
export class StudentDialogComponent {
  studentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; student?: any },
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      class_name: ['', Validators.required],
      parent_phone: [''],
    });

    if (data.isEdit && data.student) {
      this.studentForm.patchValue(data.student);
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    }
  }
}
