import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LessonService } from '../../services/lesson.service';
import { StudentService } from '../../services/student.service';
import { LessonDialogComponent } from '../lesson-dialog/lesson-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    NavbarComponent,
  ],
  template: `
    <app-navbar>
      <div class="content-container">
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Veriler yükleniyor...</p>
        </div>

        <div class="dashboard-content" *ngIf="!isLoading">
          <!-- İstatistik Kartları -->
          <div class="stats-grid">
            <mat-card *ngFor="let card of dashboardCards" class="stats-card">
              <mat-card-content>
                <div class="card-content">
                  <div class="card-icon" [style.background-color]="card.color">
                    <mat-icon>{{ card.icon }}</mat-icon>
                  </div>
                  <div class="card-text">
                    <span class="card-title">{{ card.title }}</span>
                    <span class="card-value">{{ card.value }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Dersler Başlık ve Arama -->
          <div class="header-container">
            <div class="header-left">
              <h2>Planlanan Dersler</h2>
              <div class="search-container">
                <mat-form-field appearance="outline">
                  <mat-label>Ders Ara</mat-label>
                  <input
                    matInput
                    [(ngModel)]="searchText"
                    (keyup)="filterLessons()"
                    placeholder="Öğrenci adı, ders veya konu..."
                  />
                  <mat-icon matPrefix>search</mat-icon>
                </mat-form-field>
              </div>
            </div>
            <button
              mat-raised-button
              color="primary"
              (click)="planNewLesson()"
              class="add-button"
            >
              <mat-icon>add</mat-icon>
              Yeni Ders Planla
            </button>
          </div>

          <!-- Ders Kartları -->
          <div class="cards-grid">
            <mat-card
              *ngFor="let lesson of filteredLessons"
              class="lesson-card"
            >
              <mat-card-content>
                <div class="lesson-info">
                  <div
                    class="lesson-icon"
                    [ngClass]="lesson.status.toLowerCase()"
                  >
                    <mat-icon>event</mat-icon>
                  </div>
                  <div class="lesson-details">
                    <div class="lesson-header">
                      <h3>{{ getStudentFullName(lesson.student_id) }}</h3>
                      <span
                        class="status-badge"
                        [ngClass]="lesson.status.toLowerCase()"
                      >
                        {{ lesson.status }}
                      </span>
                    </div>
                    <div class="info-row">
                      <mat-icon>schedule</mat-icon>
                      <span>{{ lesson.date }} - {{ lesson.time }}</span>
                    </div>
                    <div class="info-row">
                      <mat-icon>school</mat-icon>
                      <span>{{ lesson.subject }}</span>
                    </div>
                    <div class="info-row" *ngIf="lesson.topic">
                      <mat-icon>book</mat-icon>
                      <span>{{ lesson.topic }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <button
                    mat-icon-button
                    color="primary"
                    (click)="editLesson(lesson)"
                    matTooltip="Düzenle"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="deleteLesson(lesson)"
                    matTooltip="Sil"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Ders bulunamadığında gösterilecek mesaj -->
          <div *ngIf="filteredLessons.length === 0" class="no-results">
            <mat-icon>event_busy</mat-icon>
            <p>Ders bulunamadı</p>
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
        gap: 20px;
      }

      /* İstatistik Kartları */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .stats-card {
        border-radius: 8px;
      }

      .card-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
      }

      .card-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card-icon mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .card-text {
        display: flex;
        flex-direction: column;
      }

      .card-title {
        font-size: 13px;
        color: #666;
      }

      .card-value {
        font-size: 20px;
        font-weight: 500;
        color: #333;
      }

      /* Başlık ve Arama */
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

      /* Ders Kartları */
      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }

      .lesson-card {
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .lesson-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .lesson-info {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .lesson-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.planlandı {
          background-color: #e3f2fd;
          mat-icon {
            color: #1976d2;
          }
        }

        &.tamamlandı {
          background-color: #e8f5e9;
          mat-icon {
            color: #2e7d32;
          }
        }

        &.iptal {
          background-color: #ffebee;
          mat-icon {
            color: #c62828;
          }
        }
      }

      .lesson-icon mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .lesson-details {
        flex: 1;
      }

      .lesson-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .lesson-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
        color: #1976d2;
      }

      .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;

        &.planlandı {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        &.tamamlandı {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        &.iptal {
          background-color: #ffebee;
          color: #c62828;
        }
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
        .content-container {
          padding: 16px;
        }

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

        .stats-grid {
          grid-template-columns: 1fr;
        }

        .cards-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  students: any[] = [];
  lessons: any[] = [];
  filteredLessons: any[] = [];
  searchText = '';
  dashboardCards = [
    {
      title: 'Tamamlanan Dersler',
      value: '0',
      icon: 'check_circle',
      color: '#4caf50',
    },
    { title: 'Planlanan Dersler', value: '0', icon: 'event', color: '#2196f3' },
    {
      title: 'İptal Edilen Dersler',
      value: '0',
      icon: 'cancel',
      color: '#f44336',
    },
  ];

  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.isLoading = true;
      await Promise.all([
        this.loadStudents(),
        this.loadLessons(),
        this.loadStats(),
      ]);
      this.filteredLessons = [...this.lessons];
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadStudents() {
    this.students = await this.studentService.getAllStudents();
  }

  async loadLessons() {
    this.lessons = await this.lessonService.getPlannedLessons();
  }

  async loadStats() {
    const stats = await this.lessonService.getLessonStats();
    this.dashboardCards[0].value = stats.completed.toString();
    this.dashboardCards[1].value = stats.planned.toString();
    this.dashboardCards[2].value = stats.cancelled.toString();
  }

  filterLessons() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredLessons = this.lessons.filter((lesson) => {
      const studentName = this.getStudentFullName(
        lesson.student_id
      ).toLowerCase();
      return (
        studentName.includes(searchLower) ||
        lesson.subject.toLowerCase().includes(searchLower) ||
        (lesson.topic && lesson.topic.toLowerCase().includes(searchLower))
      );
    });
  }

  getStudentFullName(studentId: string): string {
    const student = this.students.find((s) => s.id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : '';
  }

  planNewLesson() {
    const dialogRef = this.dialog.open(LessonDialogComponent, {
      width: '400px',
      data: { students: this.students },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.lessonService.createLesson(result);
          await this.loadData();
        } catch (error) {
          console.error('Ders eklenirken hata:', error);
        }
      }
    });
  }

  editLesson(lesson: any) {
    const dialogRef = this.dialog.open(LessonDialogComponent, {
      width: '400px',
      data: {
        isEdit: true,
        lesson: lesson,
        students: this.students,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.lessonService.updateLesson(lesson.id, result);
          await this.loadData();
        } catch (error) {
          console.error('Ders güncellenirken hata:', error);
        }
      }
    });
  }

  async deleteLesson(lesson: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Ders Silme Onayı',
        message: 'Bu dersi silmek istediğinize emin misiniz?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.lessonService.deleteLesson(lesson.id);
          await this.loadData();
        } catch (error) {
          console.error('Ders silinirken hata:', error);
        }
      }
    });
  }
}
