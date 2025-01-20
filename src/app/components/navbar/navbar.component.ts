import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatDividerModule,
    MatDialogModule,
  ],
})
export class NavbarComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  isMobile = false;
  userName: string = '';

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'person', label: 'Profil', route: '/profile' },
    { icon: 'school', label: 'Öğrenciler', route: '/students' },
    { icon: 'settings', label: 'Ayarlar', route: '/settings' },
  ];

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((result) => {
        this.isMobile = result.matches;
        if (this.drawer) {
          this.drawer.mode = this.isMobile ? 'over' : 'side';
          this.drawer.opened = !this.isMobile;
        }
      });

    // Kullanıcı bilgisini al
    this.authService.getCurrentUser().subscribe((user) => {
      if (user?.user_metadata) {
        this.userName =
          user.user_metadata['first_name'] ||
          user.email?.split('@')[0] ||
          'Kullanıcı';
      }
    });
  }

  async onLogoutClick() {
    try {
      const dialogRef = this.dialog.open(LogoutDialogComponent, {
        width: '400px',
        disableClose: true,
        autoFocus: false,
        restoreFocus: false,
      });

      const result = await dialogRef.afterClosed().toPromise();

      if (result === true) {
        await this.authService.signOut();
      }
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    }
  }
}
