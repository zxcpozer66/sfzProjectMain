import * as React from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Select,
	MenuItem,
	FormControl,
} from "@mui/material";
import type { Vacation } from "../../../interfaces/modelsTypes/vacation";
import type { VacationStatus } from "../../../interfaces/modelsTypes/vacationStatus";
import {
	getVacations,
	getVacationStatuses,
	updateVacationStatus,
} from "./../../../api/index";

interface Props {
	status: "pending" | "active" | "other";
}

export default function VacationTable({ status }: Props) {
	const [data, setData] = React.useState<Vacation[]>([]);
	const [statuses, setStatuses] = React.useState<VacationStatus[]>([]);
	const [page, setPage] = React.useState(0);
	const [total, setTotal] = React.useState(0);

	const loadStatuses = async () => {
		try {
			const response = await getVacationStatuses();
			setStatuses(response);
		} catch (error) {
			console.error("Ошибка при получении статусов:", error);
		}
	};

	const loadVacations = async () => {
		try {
			const response = await getVacations({
				status,
				page: page + 1,
				per_page: 10,
			});
			setData(response.data);
			setTotal(response.total);
		} catch (error) {
			console.error("Ошибка при получении отпусков:", error);
		}
	};

	React.useEffect(() => {
		setPage(0);
	}, [status]);

	React.useEffect(() => {
		loadVacations();
	}, [page, status]);

	React.useEffect(() => {
		loadStatuses();
	}, []);

	const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

	const handleStatusChange = async (
		vacationId: number,
		newStatusId: number,
	) => {
		try {
			await updateVacationStatus(vacationId, newStatusId);
			setData((prev) =>
				prev.map((v) =>
					v.id === vacationId
						? {
								...v,
								status: statuses.find((s) => s.id === newStatusId)!,
						  }
						: v,
				),
			);
		} catch (err) {
			console.error("Ошибка при обновлении статуса", err);
		}
	};

	return (
		<Paper sx={{ width: "100%" }}>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Сотрудник</TableCell>
							<TableCell>Статус</TableCell>
							<TableCell>Начало</TableCell>
							<TableCell>Конец</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((vacation) => (
							<TableRow key={vacation.id}>
								<TableCell>
									{vacation.user.surname} {vacation.user.name}{" "}
									{vacation.user.patronymic}
								</TableCell>
								<TableCell>
									
										<FormControl size="small" sx={{ minWidth: 150 }}>
											<Select
												value={
													statuses.some((s) => s.id === vacation.status.id)
														? vacation.status.id
														: ""
												}
												onChange={(e) =>
													handleStatusChange(
														vacation.id,
														Number(e.target.value),
													)
												}
											>
												{statuses.map((status) => (
													<MenuItem key={status.id} value={status.id}>
														{status.title}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									
								</TableCell>
								<TableCell>{vacation.start_date}</TableCell>
								<TableCell>{vacation.end_date}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				labelRowsPerPage=""
				rowsPerPageOptions={[]}
				component="div"
				count={total}
				rowsPerPage={10}
				page={page}
				onPageChange={handleChangePage}
			/>
		</Paper>
	);
}
