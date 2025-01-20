import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon color="warn">logout</mat-icon>
        Çıkış Onayı
      </h2>
      <mat-dialog-content>
        <p>Çıkış yapmak istediğinizden emin misiniz?</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>
          <mat-icon>close</mat-icon>
          İptal
        </button>
        <button mat-raised-button color="warn" [mat-dialog-close]="true">
          <mat-icon>logout</mat-icon>
          Çıkış Yap
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 20px;
        min-width: 320px;
      }
      h2 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #f44336;
      }
      mat-dialog-content {
        margin: 20px 0;
        color: #666;
      }
      mat-dialog-content p {
        margin: 0;
      }
      mat-dialog-actions {
        padding: 20px 0 0;
        margin-bottom: 0;
      }
      button {
        display: flex;
        align-items: center;
        gap: 8px;
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
    `,
  ],
})
export class LogoutDialogComponent {}
