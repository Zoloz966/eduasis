export enum TypeSubject {
  COMUNIDAD_Y_SOCIEDAD = 'Comunidad y Sociedad',
  CIENCIA_TECNOLOGIA_Y_PRODUCCION = 'Ciencia, Tecnología y Producción',
  VIDA_TIERRA_Y_TERRITORIO = 'Vida, Tierra y Territorio',
  COSMOS_Y_PENSAMIENTO = 'Cosmos y Pensamiento',
}

export interface Subject {
  id_subject: number;
  subject_name: string;
  type_subject: TypeSubject;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  // classes
}
