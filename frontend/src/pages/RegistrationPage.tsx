import { useEffect, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import {
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { getDepartments } from "../api";
import { registration } from "./../api/index";
import { useNavigate } from "react-router-dom";
import type { Department } from "../interfaces/modelsTypes/department";

interface FormData {
	name: string;
	surname: string;
	patronymic: string;
	department_id: number | string;
}

interface FormErrors {
	name: string;
	surname: string;
	patronymic: string;
	department_id: string;
}

interface TouchedFields {
	name: boolean;
	surname: boolean;
	patronymic: boolean;
	department_id: boolean;
}

export const RegistrationPage = () => {
	const [departments, setDepartments] = useState<Department[]>([]);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				const res = await getDepartments();
				setDepartments(res?.data ?? []);
			} catch (error) {
				console.error("Ошибка при загрузке Departments:", error);
				setDepartments([]);
			}
		};

		fetchDepartments();
	}, []);

	const [formData, setFormData] = useState<FormData>({
		name: "",
		surname: "",
		patronymic: "",
		department_id: "",
	});

	const [errors, setErrors] = useState<FormErrors>({
		name: "",
		surname: "",
		patronymic: "",
		department_id: "",
	});

	const [touched, setTouched] = useState<TouchedFields>({
		name: false,
		surname: false,
		patronymic: false,
		department_id: false,
	});

	const russianLettersRegex = /^[а-яёА-ЯЁ]+$/;

	const validateField = (_name: keyof FormData, value: string): string => {
		if (!value.trim()) {
			return "Поле обязательно для заполнения";
		}

		if (!russianLettersRegex.test(value)) {
			return "Поле должно содержать только русские буквы без пробелов";
		}

		return "";
	};

	const validateDepartment = (value: string | number): string => {
		if (!value) {
			return "Выберите отдел";
		}
		return "";
	};

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (touched[name as keyof TouchedFields]) {
			let error = "";
			if (name === "department_id") {
				error = validateDepartment(value);
			} else {
				error = validateField(name as keyof FormData, value as string);
			}

			setErrors((prev) => ({
				...prev,
				[name]: error,
			}));
		}
	};

	const handleSelectChange = (e: SelectChangeEvent<number | string>) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name as string]: value,
		}));

		if (touched.department_id) {
			const error = validateDepartment(value);
			setErrors((prev) => ({
				...prev,
				department_id: error,
			}));
		}
	};

	const handleBlur = (
		e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;

		setTouched((prev) => ({
			...prev,
			[name as keyof TouchedFields]: true,
		}));

		let error = "";
		if (name === "department_id") {
			error = validateDepartment(value);
		} else {
			error = validateField(name as keyof FormData, value as string);
		}

		setErrors((prev) => ({
			...prev,
			[name as keyof FormErrors]: error,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setTouched({
			name: true,
			surname: true,
			patronymic: true,
			department_id: true,
		});

		const newErrors = {
			name: validateField("name", formData.name),
			surname: validateField("surname", formData.surname),
			patronymic: validateField("patronymic", formData.patronymic),
			department_id: validateDepartment(formData.department_id),
		};

		setErrors(newErrors);

		const hasErrors = Object.values(newErrors).some((error) => error !== "");

		if (!hasErrors) {
			try {
				const dataToSend = {
					...formData,
					department_id: Number(formData.department_id),
				};
				await registration(dataToSend);
				navigate("/");
			} catch (e) {
				console.error(e);
			}
		}
	};

	return (
		<Box
			sx={{
				minHeight: "70vh",
				backgroundColor: "#ffffff",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{
					width: "100%",
					maxWidth: "400px",
					"& .MuiFormHelperText-root": {
						position: "absolute",
						bottom: "-20px",
						visibility: "hidden",
						"&.show": {
							visibility: "visible",
						},
					},
					"& .MuiTextField-root, & .MuiFormControl-root": {
						marginBottom: "30px",
						position: "relative",
					},
				}}
			>
				<Typography variant="h4" component="h1" align="center" sx={{ mb: 3 }}>
					Регистрация
				</Typography>
				<TextField
					fullWidth
					name="surname"
					label="Фамилия"
					value={formData.surname}
					onChange={handleInputChange}
					onBlur={handleBlur}
					error={touched.surname && !!errors.surname}
					helperText={touched.surname && errors.surname}
					FormHelperTextProps={{
						className: touched.surname && errors.surname ? "show" : "",
					}}
				/>

				<TextField
					fullWidth
					name="name"
					label="Имя"
					value={formData.name}
					onChange={handleInputChange}
					onBlur={handleBlur}
					error={touched.name && !!errors.name}
					helperText={touched.name && errors.name}
					FormHelperTextProps={{
						className: touched.name && errors.name ? "show" : "",
					}}
				/>

				<TextField
					fullWidth
					name="patronymic"
					label="Отчество"
					value={formData.patronymic}
					onChange={handleInputChange}
					onBlur={handleBlur}
					error={touched.patronymic && !!errors.patronymic}
					helperText={touched.patronymic && errors.patronymic}
					FormHelperTextProps={{
						className: touched.patronymic && errors.patronymic ? "show" : "",
					}}
				/>

				<FormControl
					fullWidth
					error={touched.department_id && !!errors.department_id}
				>
					<InputLabel>Отдел</InputLabel>
					<Select
						name="department_id"
						value={formData.department_id}
						label="Отдел"
						onChange={handleSelectChange}
						onBlur={handleBlur as any}
					>
						{departments.map((dept) => (
							<MenuItem key={dept.id} value={dept.id}>
								{dept.title}
							</MenuItem>
						))}
					</Select>
					<Typography
						variant="caption"
						color="error"
						sx={{
							position: "absolute",
							bottom: "-20px",
							left: "14px",
							visibility:
								touched.department_id && errors.department_id
									? "visible"
									: "hidden",
						}}
					>
						{errors.department_id}
					</Typography>
				</FormControl>

				<Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
					Зарегистрироваться
				</Button>
			</Box>
		</Box>
	);
};
