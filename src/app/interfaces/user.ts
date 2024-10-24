import { Role } from './role';

export interface User {
  id_user: number;
  name: string;
  id: string;
  email: string;
  roleIdRole: number;
  password?: string;
  token: string;
  code_country: string;
  phone: string;
  photo: string;
  isEnabled: number;
  info: string;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  role?: Role;
  id_student?: number;
}

export interface UserResponse {
  access_token: string;
  user: User;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface MenuItem {
  id_access: number;
  name: string;
  icon: string;
  link: string;
  section: string;
  father: string;
  position: string;
  isSelect: boolean;
}

export interface UserLog {
  id_user_logs: number;
  title: string;
  detail: string;
  userIdUser: number;
  color: string;
  icon: string;
  user?: User;
}
