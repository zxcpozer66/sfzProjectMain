import axios from "axios";
import { config } from "../../config";

const API_BASE_URL = `${config.apiUrl}api/applications`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getApplications = () => {
	return apiClient.get("/");
};

export const deleteApplication = async (id: number) => {
	const res = await apiClient.delete(`/${id}`);
	return res.data;
};

export const editApplication = async (id: number, value: {}) => {
	const res = await apiClient.patch(`/${id}`, value);
	return res.data;
};

export const addApplication = async (formData: {
	user_id: number;
	description_problem: string;
	appeal_title: string;
}) => {
	const res = await apiClient.post("/", formData);
	return res.data;
};
