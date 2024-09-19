import { MenuItem } from './user';

export interface Role {
  id_role: number;
  name: string;
  access: MenuItem[];
  id_access?: number[];
}
