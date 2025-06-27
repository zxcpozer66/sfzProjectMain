export interface Department {
  id: number;
  title: string | undefined;
  parent_department?: {
    id?: number;
    title?: string;
  } | null;
  chief?: {
    name: string;
    surname: string;
    patronymic: string;
    user_id: number;
  } | null;
}