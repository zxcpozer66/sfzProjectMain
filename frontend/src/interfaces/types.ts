export interface UserData {
	id: number;
	username: string;
	name: string;
	surname: string;
	patronymic: string;
	department: string;
	department_id: number;
	total_work_hours: number;
	available_hours: number;
	role_id: number
	role: Role
}

export interface Role {
	id: number;
	title: string;
}



export type HeadCell = {
	id: keyof UserData;
	label: string;
	align: "left" | "center" | "right" | "justify";
};
