import type { Department } from "../modelsTypes/department";
import type { Notation } from "../modelsTypes/notation";
import type { Reaction } from "../modelsTypes/reaction";
import type { User } from "../modelsTypes/user";
import type { RequestData } from "./requestData";

export function createData(
	id: number,
	data: Date,
	department: Department,
	order_application: string,
	user: User,
	master: User,
	appeal_title: string,
	notation: Notation,
	start_time: Date,
	reaction_type: Reaction,
	end_time: Date,
): RequestData {
	return {
		id,
		data,
		notation,
		department,
		order_application,
		user,
		master,
		appeal_title,
		start_time,
		reaction_type,
		end_time,
	};
}
