import axios from "axios";
import type { User } from "../../interfaces/modelsTypes/user";
import { config } from "../../config";

const API_BASE_URL = `${config.apiUrl}api/users`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getUsers = () => {
	return apiClient.get("/");
};

export const getUsersRole = async (
	roleId: number,
	include = true,
): Promise<User[]> => {
	const res = await apiClient.get(`/role/${roleId}`, {
		params: { include },
	});
	return res.data;
};

export const getCurrentUser = () => {
	return apiClient.get("/current-user");
};

export const getAvailableHours = () => {
	return apiClient.get("/get-available-hours");
};

export const getRole = () => {
	return apiClient.get("/role")
}


export const addUser = async (userData: {
	surname: string;
	name: string;
	patronymic: string;
}): Promise<User> => {
	const res = await apiClient.post("/", userData);
	return res.data;
};

export const deleteUser = async (id: number) => {
	const res = await apiClient.delete(`/${id}`);
	return res.data;
};

export const editUser = async (id: number, value: {}) => {
	const res = await apiClient.patch(`/${id}`, value);
	return res.data;
};

export const getUsersVacationInterval = () => {
	return apiClient.get("/vacation-interval");
};

export const registration = (userData: {
	surname: string;
	name: string;
	patronymic: string;
	department_id: number;
}) => {
	return apiClient.patch("/registration", userData);
};
