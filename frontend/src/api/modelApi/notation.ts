import axios from "axios";
import { config } from "../../config";

const API_BASE_URL = `${config.apiUrl}api/notations`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getNotation = () => {
	return apiClient.get("/");
};
