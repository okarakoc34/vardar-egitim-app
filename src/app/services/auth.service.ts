import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Sayfa yüklendiğinde mevcut session'ı kontrol et
    this.checkSession();

    // Auth durumu değişikliklerini dinle
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUser.next(session?.user ?? null);
        this.router.navigate(['/dashboard']);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      } else if (event === 'TOKEN_REFRESHED') {
        this.currentUser.next(session?.user ?? null);
      }
    });
  }

  private async checkSession() {
    try {
      const {
        data: { session },
        error,
      } = await this.supabase.auth.getSession();
      if (error) throw error;

      this.currentUser.next(session?.user ?? null);

      if (session?.user) {
        // Session varsa ve token geçerliyse dashboard'a yönlendir
        this.router.navigate(['/dashboard']);
      } else {
        // Session yoksa veya token geçersizse login'e yönlendir
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Session check error:', error);
      this.currentUser.next(null);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        return { success: true };
      }

      return {
        success: false,
        message: 'Giriş başarısız',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Giriş sırasında bir hata oluştu',
      };
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }
}
