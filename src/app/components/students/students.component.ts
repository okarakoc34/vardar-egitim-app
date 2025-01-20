import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/database.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentDialogComponent } from './student-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../navbar/navbar.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    NavbarComponent,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  template: `
    <app-navbar>
      <div class="content-container">
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Öğrenciler yükleniyor...</p>
        </div>

        <div class="dashboard-content" *ngIf="!isLoading">
          <div class="header-container">
            <div class="header-left">
              <h2>Öğrenciler</h2>
              <div class="search-container">
                <mat-form-field appearance="outline">
                  <mat-label>Öğrenci Ara</mat-label>
                  <input
                    matInput
                    [(ngModel)]="searchText"
                    (keyup)="filterStudents()"
                    placeholder="Ad, soyad veya sınıf..."
                  />
                  <mat-icon matPrefix>search</mat-icon>
                </mat-form-field>
              </div>
            </div>
            <button
              mat-raised-button
              color="primary"
              (click)="addStudent()"
              class="add-button"
            >
              <mat-icon>add</mat-icon>
              Yeni Öğrenci Ekle
            </button>
          </div>

          <div class="cards-grid">
            <mat-card
              *ngFor="let student of filteredStudents"
              class="student-card"
            >
              <mat-card-content>
                <div class="student-info">
                  <div class="student-avatar">
                    <mat-icon>person</mat-icon>
                  </div>
                  <div class="student-details">
                    <h3>{{ student.first_name }} {{ student.last_name }}</h3>
                    <div class="info-row">
                      <mat-icon>school</mat-icon>
                      <span>{{ student.class_name }}</span>
                    </div>
                    <div class="info-row" *ngIf="student.parent_phone">
                      <mat-icon>phone</mat-icon>
                      <span>{{ student.parent_phone }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <button
                    mat-icon-button
                    color="primary"
                    (click)="editStudent(student)"
                    matTooltip="Düzenle"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="deleteStudent(student)"
                    matTooltip="Sil"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Öğrenci bulunamadığında gösterilecek mesaj -->
          <div *ngIf="filteredStudents.length === 0" class="no-results">
            <mat-icon>search_off</mat-icon>
            <p>Öğrenci bulunamadı</p>
          </div>
        </div>
      </div>
    </app-navbar>
  `,
  styles: [
    `
      .content-container {
        padding: 20px;
        height: calc(100vh - 64px);
        overflow-y: auto;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .loading-container p {
        margin-top: 16px;
        color: #666;
      }

      .dashboard-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        background: white;
        padding: 10px 16px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }

      .header-left h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #1a237e;
        white-space: nowrap;
      }

      .search-container {
        flex: 1;
        max-width: 250px;
      }

      .search-container mat-form-field {
        width: 100%;
      }

      :host ::ng-deep .search-container {
        .mat-mdc-form-field {
          display: inline-flex;
          flex-direction: column;
          min-width: 0;
          text-align: left;
        }

        .mat-mdc-form-field-wrapper {
          padding-bottom: 0;
        }

        .mat-mdc-form-field-subscript-wrapper {
          display: none;
        }

        .mat-mdc-text-field-wrapper {
          height: 40px;
          padding: 0 12px;
          background-color: #f5f5f5;
          border-radius: 20px;
        }

        .mat-mdc-form-field-flex {
          height: 40px;
          align-items: center;
          padding: 0 4px;
        }

        .mat-mdc-form-field-infix {
          padding: 0;
          border-top: 0;
        }

        .mdc-text-field--outlined {
          --mdc-outlined-text-field-container-height: 40px;
        }

        .mat-mdc-form-field-icon-prefix {
          padding: 0 8px 0 0;
          color: #666;
        }

        input.mat-mdc-input-element {
          font-size: 13px;
          line-height: 40px;
          margin-top: 0;
        }

        .mdc-notched-outline__leading,
        .mdc-notched-outline__notch,
        .mdc-notched-outline__trailing {
          border-color: transparent !important;
        }

        .mdc-notched-outline {
          display: none;
        }

        .mat-mdc-form-field-label-wrapper {
          top: 0;
          padding-top: 0;
        }

        .mat-mdc-form-field-label {
          font-size: 13px;
          line-height: 40px;
          color: #666;
        }
      }

      .add-button {
        height: 36px;
        padding: 0 12px;
        font-weight: 500;
        border-radius: 18px;
        font-size: 13px;
        line-height: 36px;

        mat-icon {
          font-size: 18px;
          height: 18px;
          width: 18px;
          margin-right: 4px;
        }
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        padding: 8px 0;
      }

      .student-card {
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .student-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .student-info {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .student-avatar {
        background-color: #e3f2fd;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .student-avatar mat-icon {
        color: #1976d2;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .student-details {
        flex: 1;
      }

      .student-details h3 {
        margin: 0 0 6px 0;
        font-size: 16px;
        font-weight: 500;
        color: #1976d2;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        color: #666;
        font-size: 13px;
      }

      .info-row mat-icon {
        font-size: 14px;
        width: 14px;
        height: 14px;
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #eee;
      }

      .card-actions button {
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .card-actions mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .no-results {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 48px;
        color: #666;
      }

      .no-results mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        color: #999;
      }

      @media (max-width: 800px) {
        .header-container {
          flex-direction: column;
          padding: 16px;
          gap: 16px;
        }

        .header-left {
          flex-direction: column;
          align-items: stretch;
          gap: 16px;
          width: 100%;
        }

        .header-left h2 {
          text-align: center;
        }

        .search-container {
          max-width: 100%;
        }

        .add-button {
          width: 100%;
        }
      }
    `,
  ],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  isLoading = true;
  searchText = '';

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  async loadStudents() {
    try {
      this.isLoading = true;
      this.students = await this.studentService.getAllStudents();
      this.filteredStudents = [...this.students];
    } catch (error) {
      this.toastr.error('Öğrenciler yüklenirken bir hata oluştu', 'Hata');
    } finally {
      this.isLoading = false;
    }
  }

  filterStudents() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredStudents = this.students.filter(
      (student) =>
        student.first_name.toLowerCase().includes(searchLower) ||
        student.last_name.toLowerCase().includes(searchLower) ||
        student.class_name.toLowerCase().includes(searchLower)
    );
  }

  addStudent() {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '400px',
      data: { title: 'Yeni Öğrenci Ekle' },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.studentService.createStudent(result);
          this.toastr.success('Öğrenci başarıyla eklendi');
          await this.loadStudents();
        } catch (error) {
          this.toastr.error('Öğrenci eklenirken bir hata oluştu');
          console.error('Öğrenci eklenirken hata:', error);
        }
      }
    });
  }

  editStudent(student: Student) {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '400px',
      data: {
        isEdit: true,
        student: student,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.studentService.updateStudent(student.id, result);
          this.toastr.success('Öğrenci başarıyla güncellendi');
          await this.loadStudents();
        } catch (error) {
          this.toastr.error('Öğrenci güncellenirken bir hata oluştu');
          console.error('Öğrenci güncellenirken hata:', error);
        }
      }
    });
  }

  async deleteStudent(student: Student) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Öğrenci Silme Onayı',
        message: 'Bu öğrenciyi silmek istediğinize emin misiniz?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.studentService.deleteStudent(student.id);
          await this.loadStudents();
        } catch (error) {
          console.error('Öğrenci silinirken hata:', error);
        }
      }
    });
  }
}
