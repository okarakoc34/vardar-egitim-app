export interface Teacher {
  id: string; // uuid
  first_name: string;
  last_name: string;
  branch: string;
  phone?: string;
  created_at: string;
}

export interface Student {
  id: string; // uuid
  first_name: string;
  last_name: string;
  class_name: string;
  parent_phone?: string;
  created_at: string;
}

export interface Lesson {
  id: string; // uuid
  teacher_id: string; // uuid
  student_id: string; // uuid
  date: string;
  time: string;
  subject: string;
  topic?: string;
  status: 'Planlandı' | 'Tamamlandı' | 'İptal Edildi';
  notes?: string;
  created_at: string;
}
