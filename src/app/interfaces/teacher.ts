export enum Gender {
  Masculino = 'Masculino',
  Femenino = 'Femenino',
}

export interface Teacher {
  id_teacher: number;
  name: string;
  lastname: string;
  id: string;
  email: string;
  password?: string;
  roleIdRole: number;
  token: string;
  gender: Gender;
  code_country: string;
  phone: string;
  birth_date: Date;
  photo: string;
  isEnabled: number;
  info: string;
  status: number;
  updated_at: Date;
}
