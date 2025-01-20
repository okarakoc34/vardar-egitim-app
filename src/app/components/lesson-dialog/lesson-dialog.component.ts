import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  DateAdapter,
} from '@angular/material/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Student } from '../../models/database.models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lesson-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.isEdit ? 'edit' : 'add_circle' }}</mat-icon>
        {{ data.isEdit ? 'Dersi Düzenle' : 'Yeni Ders Planla' }}
      </h2>

      <div class="dialog-content">
        <form [formGroup]="lessonForm" class="lesson-form">
          <mat-form-field appearance="outline">
            <mat-label>Öğrenci Seçin</mat-label>
            <mat-select formControlName="student_id" required>
              <mat-option
                *ngFor="let student of data.students"
                [value]="student.id"
              >
                {{ student.first_name }} {{ student.last_name }} -
                {{ student.class_name }}
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>person</mat-icon>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Tarih</mat-label>
              <input
                matInput
                [matDatepicker]="picker"
                formControlName="date"
                required
              />
              <mat-datepicker-toggle
                matSuffix
                [for]="picker"
              ></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-icon matPrefix>event</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Saat</mat-label>
              <mat-select formControlName="time" required>
                <mat-option *ngFor="let time of timeSlots" [value]="time">
                  {{ time }}
                </mat-option>
              </mat-select>
              <mat-icon matPrefix>schedule</mat-icon>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Ders</mat-label>
            <input matInput formControlName="subject" required />
            <mat-icon matPrefix>school</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Konu</mat-label>
            <input matInput formControlName="topic" />
            <mat-icon matPrefix>book</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Durum</mat-label>
            <mat-select formControlName="status" required>
              <mat-option
                *ngFor="let option of statusOptions"
                [value]="option.value"
              >
                <div style="display: flex; align-items: center;">
                  <span
                    class="status-dot"
                    [style.background-color]="option.color"
                  ></span>
                  {{ option.value }}
                </div>
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>flag</mat-icon>
          </mat-form-field>
        </form>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          İptal
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="!lessonForm.valid"
        >
          <mat-icon>{{ data.isEdit ? 'save' : 'add' }}</mat-icon>
          {{ data.isEdit ? 'Güncelle' : 'Kaydet' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 16px;
        max-width: 450px;
      }

      h2 {
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
        font-size: 18px;
      }

      .lesson-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
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

      textarea {
        min-height: 80px;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }

      @media screen and (max-width: 600px) {
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
export class LessonDialogComponent implements OnInit {
  timeSlots: string[] = [];
  statusOptions = [
    { value: 'Planlandı', color: '#2196F3' },
    { value: 'Tamamlandı', color: '#4CAF50' },
    { value: 'İptal Edildi', color: '#F44336' },
  ];
  lessonForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<LessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('tr');
    this.generateTimeSlots();

    this.lessonForm = this.fb.group({
      student_id: ['', Validators.required],
      date: [null, Validators.required],
      time: ['', Validators.required],
      subject: ['Matematik', Validators.required],
      topic: [''],
      status: ['Planlandı', Validators.required],
    });
  }

  ngOnInit() {
    if (this.data.isEdit && this.data.lesson) {
      // Tarihi Date objesine çevir
      let lessonDate = null;
      if (this.data.lesson.date) {
        const [day, month, year] = this.data.lesson.date.split('.');
        lessonDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      }

      // Form değerlerini yükle
      this.lessonForm.setValue({
        student_id: this.data.lesson.student_id,
        date: lessonDate,
        time: this.data.lesson.time,
        subject: this.data.lesson.subject,
        topic: this.data.lesson.topic || '',
        status: this.data.lesson.status,
      });
    }
  }

  generateTimeSlots() {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute of ['00', '30']) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute}`);
      }
    }
    this.timeSlots = slots;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.lessonForm.valid) {
      const formValue = { ...this.lessonForm.value };
      const dateValue = formValue.date;

      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        const day = dateValue.getDate().toString().padStart(2, '0');
        const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
        const year = dateValue.getFullYear();

        formValue.date = `${day}.${month}.${year}`;
        this.dialogRef.close(formValue);
      } else if (typeof dateValue === 'string') {
        // Eğer tarih zaten string formatında ise olduğu gibi kullan
        this.dialogRef.close(formValue);
      } else {
        console.error('Geçersiz tarih formatı');
      }
    }
  }
}
