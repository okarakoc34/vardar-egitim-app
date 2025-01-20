import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Student } from '../../models/database.models';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.isEdit ? 'edit' : 'add_circle' }}</mat-icon>
        {{ data.isEdit ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle' }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="studentForm" class="student-form">
          <mat-form-field appearance="outline">
            <mat-label>Ad</mat-label>
            <input matInput formControlName="first_name" required />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Soyad</mat-label>
            <input matInput formControlName="last_name" required />
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Sınıf</mat-label>
            <input matInput formControlName="class_name" required />
            <mat-icon matPrefix>school</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Veli Telefon</mat-label>
            <input matInput formControlName="parent_phone" />
            <mat-icon matPrefix>phone</mat-icon>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          İptal
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="!studentForm.valid"
        >
          <mat-icon>{{ data.isEdit ? 'save' : 'add' }}</mat-icon>
          {{ data.isEdit ? 'Güncelle' : 'Kaydet' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 16px;
        max-width: 400px;
      }

      h2 {
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
        font-size: 18px;
      }

      .student-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      mat-form-field {
        width: 100%;
      }

      mat-dialog-content {
        margin: 0;
        padding: 0;
        max-height: 65vh;
      }

      mat-dialog-actions {
        margin: 16px -16px -16px;
        padding: 16px;
        background: #f8f9fa;
      }

      button {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      @media screen and (max-width: 600px) {
        .action-buttons {
          flex-direction: column;
          gap: 10px;
        }

        .mat-dialog-container {
          padding: 10px;
        }

        .mat-form-field {
          width: 100%;
        }

        .mat-form-field-infix {
          padding: 0 8px;
        }

        .mat-form-field-label {
          font-size: 12px;
        }

        .mat-form-field-underline {
          height: 1px;
        }

        .mat-form-field-subscript-wrapper {
          margin-top: 4px;
        }
      }
    `,
  ],
})
export class StudentDialogComponent {
  studentForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { isEdit: boolean; student?: Student },
    private fb: FormBuilder
  ) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      class_name: ['', Validators.required],
      parent_phone: [''],
    });

    if (data.isEdit && data.student) {
      console.log('Düzenlenecek öğrenci:', data.student);
      this.studentForm.patchValue({
        first_name: data.student.first_name,
        last_name: data.student.last_name,
        class_name: data.student.class_name,
        parent_phone: data.student.parent_phone || '',
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    }
  }
}
