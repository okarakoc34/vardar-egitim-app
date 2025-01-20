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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
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
    MatButtonToggleModule,
    MatTableModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  students: any[] = [];
  lessons: any[] = [];
  filteredLessons: any[] = [];
  searchText = '';
  selectedStatus = 'Planlandı';
  plannedLessons: any[] = [];
  dashboardCards = [
    {
      title: 'Tamamlanan Dersler',
      value: '0',
      icon: 'check_circle',
      color: '#4caf50',
    },
    {
      title: 'Planlanan Dersler',
      value: '0',
      icon: 'event',
      color: '#2196f3',
    },
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
      await Promise.all([this.loadStudents(), this.loadLessons()]);
      await this.loadStats();
      this.filterLessons();
      this.isLoading = false;
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
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
    this.filteredLessons = this.lessons.filter((lesson) => {
      const matchesSearch =
        !this.searchText ||
        this.getStudentFullName(lesson.student_id)
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        lesson.subject.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (lesson.topic &&
          lesson.topic.toLowerCase().includes(this.searchText.toLowerCase()));

      const matchesStatus =
        this.selectedStatus === 'all' || lesson.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    // Tarihe göre sıralama
    this.filteredLessons.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA.getTime() - dateB.getTime();
    });

    this.plannedLessons = [...this.filteredLessons];
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
