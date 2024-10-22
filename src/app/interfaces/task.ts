import { Class } from "./class";
import { Student } from "./student";

export interface Task {
  id_task: number;
  task_tittle: string;
  description: string;
  classIdClass: number;
  studentIdStudent: number;
  end_date: Date;
  isCompleted: number;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  student?: Student;
  class?: Class;
}
