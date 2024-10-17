import { Student } from './student';
import { Teacher } from './teacher';
import { Course } from './course';
import { Subject } from './subject';

export enum Shift {
  Mañana = 'Mañana',
  Tarde = 'Tarde',
  Nocturno = 'Nocturno',
}
export interface Class {
  id_class: number;
  teacherIdTeacher: number;
  subjectIdSubject: number;
  courseIdCourse: number;
  class_name: string;
  shift: Shift;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  students?: Student[];
  teacher?: Teacher;
  subject?: Subject;
  course?: Course;
}
