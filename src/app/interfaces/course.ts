import { Student } from './student';
import { Teacher } from './teacher';

export interface Course {
  id_course: number;
  course_name: string;
  parallel: string;
  age: number;
  teacher_id: number;
  students?: Student[];
  // classes: Classes[];
  teacher?: Teacher;
}
