import axios from "axios";
import { config } from "../../config";

const API_BASE_URL = `${config.apiUrl}api/vacations`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const addVacation = async (rangeDate: {
	startDate: Date;
	endDate: Date;
	hours: Number;
}) => {
	const res = await apiClient.post("/", {
		start_date: rangeDate.startDate.toISOString().split("T")[0],
		end_date: rangeDate.endDate.toISOString().split("T")[0],
		hours: rangeDate.hours
	});
	return res.data;
};

interface VacationParams {
	status?: "pending" | "active" | "other";
	page?: number;
	per_page?: number;
}

export const getVacations = async (params: VacationParams) => {
	const res = await axios.get(API_BASE_URL, { params });
	return res.data;
};

export const getVacationStatuses = async () => {
	const res = await axios.get(`${API_BASE_URL}/vacation-statuses`);
	return res.data;
};

export const updateVacationStatus = async (
	vacationId: number,
	statusId: number,
) => {
	const res = await axios.patch(`${API_BASE_URL}/${vacationId}`, {
		vacation_status_id: statusId,
	});
	return res.data;
};


export const myVacation = () => {
	return apiClient.get("/my-vacation");
};


export const deleteVacation = async (id: number) => {
	const res = await apiClient.delete(`/${id}`);
	return res.data;
};