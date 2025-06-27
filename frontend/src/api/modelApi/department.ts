import axios from "axios";
import { config } from "../../config";

const API_BASE_URL = `${config.apiUrl}api/departments`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getDepartments = () => {
	return apiClient.get("/");
};

export const addDepartment = (value: any) => {
	return apiClient.post("/", value);
}

export const deleteDepartment = async (id: number) => {
	const res = await apiClient.delete(`/${id}`);
	return res.data;
};

export const editDepartment = async (id: number, value: {}) => {
	const res = await apiClient.patch(`/${id}`, value);
	return res.data;
};