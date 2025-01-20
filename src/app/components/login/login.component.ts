import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true; // şifre göster/gizle için
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit() {
    // Kayıtlı email'i kontrol et
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true,
      });
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password, rememberMe } = this.loginForm.value;

      try {
        const result = await this.authService.signIn(email, password);

        if (result.success) {
          // Beni hatırla seçili ise email'i kaydet
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }

          this.toastr.success(
            'Giriş başarılı! Yönlendiriliyorsunuz...',
            'Başarılı'
          );
        } else {
          this.toastr.error(
            result.message ||
              'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
            'Hata'
          );
        }
      } catch (error: any) {
        let errorMessage = 'Bir hata oluştu';

        // Supabase hata mesajlarını Türkçeleştirme
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Geçersiz e-posta veya şifre';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'E-posta adresi henüz onaylanmamış';
        } else if (error.message?.includes('Too many requests')) {
          errorMessage = 'Çok fazla deneme yaptınız. Lütfen bir süre bekleyin';
        }

        this.toastr.error(errorMessage, 'Hata');
      } finally {
        this.loading = false;
      }
    } else {
      this.toastr.warning(
        'Lütfen tüm alanları doğru şekilde doldurun.',
        'Uyarı'
      );
    }
  }
}
