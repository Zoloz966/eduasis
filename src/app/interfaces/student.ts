import { Course } from "./course";
import { Role } from "./role";
import { Gender } from "./teacher";

export interface Student {
  id_student: number;
  name: string;
  lastname: string;
  id: string;
  email: string;
  password?: string;
  courseIdCourse:number
  roleIdRole?: number;
  token: string;
  gender: Gender;
  code_country: string;
  tutor_phone: string;
  birth_date: Date;
  photo: string;
  qr_image: string;
  isEnabled: number;
  info: string;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  role?: Role;
  course?: Course
}
