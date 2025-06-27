import type { Department } from "../modelsTypes/department";
import type { Notation } from "../modelsTypes/notation";
import type { Reaction } from "../modelsTypes/reaction";
import type { User } from "../modelsTypes/user";

export interface RequestData {
  id: number;
  data: Date;
  department: Department;
  user: User;
  start_time?: Date;
  master: User;
  appeal_title: string;
  end_time?: Date;
  description_problem?: string;
  description_task?: string;
  answer?: string;
  notation_id?: number;
  notation?: Notation;
  type_reaction_id?: number;
  order_application?: string;
  reaction_type: Reaction;
  set_start_time?: boolean;
  set_end_time?: boolean;
  setStartTime?: boolean;
  setEndTime?:boolean;
}
