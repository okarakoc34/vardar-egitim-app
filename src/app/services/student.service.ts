import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Student } from '../models/database.models';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private authService: AuthService) {}

  async getAllStudents(): Promise<Student[]> {
    try {
      const { data: students, error } = await this.authService.supabase
        .from('students')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      return students || [];
    } catch (error) {
      console.error('Öğrenciler listelenirken hata:', error);
      throw error;
    }
  }

  async createStudent(
    student: Omit<Student, 'id' | 'created_at'>
  ): Promise<Student> {
    try {
      const { data, error } = await this.authService.supabase
        .from('students')
        .insert([student])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Öğrenci eklenirken hata:', error);
      throw error;
    }
  }

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    try {
      const { data, error } = await this.authService.supabase
        .from('students')
        .update(student)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Öğrenci güncellenirken hata:', error);
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<void> {
    try {
      const { error } = await this.authService.supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Öğrenci silinirken hata:', error);
      throw error;
    }
  }
}
