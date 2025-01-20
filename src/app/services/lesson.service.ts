import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';
import { Lesson } from '../models/database.models';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private lessonsSubject = new BehaviorSubject<Lesson[]>([]);
  lessons$ = this.lessonsSubject.asObservable();

  constructor(private supabase: SupabaseService) {}

  async getPlannedLessons(): Promise<Lesson[]> {
    try {
      const {
        data: { user },
      } = await this.supabase.client.auth.getUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error } = await this.supabase.client
        .from('lessons')
        .select('*')
        .eq('teacher_id', user.id)
        .order('date', { ascending: false })
        .order('time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Dersler yüklenirken hata:', error);
      throw error;
    }
  }

  async getLessonStats(): Promise<{
    completed: number;
    planned: number;
    cancelled: number;
  }> {
    try {
      const {
        data: { user },
      } = await this.supabase.client.auth.getUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { data, error } = await this.supabase.client
        .from('lessons')
        .select('status')
        .eq('teacher_id', user.id);

      if (error) throw error;

      const stats = {
        completed: 0,
        planned: 0,
        cancelled: 0,
      };

      data?.forEach((lesson) => {
        switch (lesson.status.toLowerCase()) {
          case 'tamamlandı':
            stats.completed++;
            break;
          case 'planlandı':
            stats.planned++;
            break;
          case 'iptal':
            stats.cancelled++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      throw error;
    }
  }

  async createLesson(lesson: Partial<Lesson>): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabase.client.auth.getUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const lessonWithTeacher = {
        ...lesson,
        teacher_id: user.id,
        status: 'Planlandı',
      };

      const { error } = await this.supabase.client
        .from('lessons')
        .insert([lessonWithTeacher]);

      if (error) throw error;
    } catch (error) {
      console.error('Ders eklenirken hata:', error);
      throw error;
    }
  }

  async updateLesson(id: string, lesson: Partial<Lesson>): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabase.client.auth.getUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { error } = await this.supabase.client
        .from('lessons')
        .update(lesson)
        .eq('id', id)
        .eq('teacher_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Ders güncellenirken hata:', error);
      throw error;
    }
  }

  async deleteLesson(id: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabase.client.auth.getUser();
      if (!user) throw new Error('Kullanıcı bulunamadı');

      const { error } = await this.supabase.client
        .from('lessons')
        .delete()
        .eq('id', id)
        .eq('teacher_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Ders silinirken hata:', error);
      throw error;
    }
  }
}
