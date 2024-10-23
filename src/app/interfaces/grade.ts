import { Class } from './class';
import { Student } from './student';
export enum TypeGrade {
  PRIMER_TRIMESTRE = 'Primer Trimestre',
  SEGUNDO_TRIMESTRE = 'Segundo Trimestre',
  TERCER_TRIMESTRE = 'Tercer Trimestre',
}
export interface Grade {
  id_grade: number;
  studentIdStudent: number;
  classIdClass: number;
  grade: number;
  type_grade: TypeGrade;
  created_at?: Date;
  updated_at?: Date;
  student?: Student;
  class?: Class;
}
