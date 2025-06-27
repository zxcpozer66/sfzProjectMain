import { useEffect, useState } from "react";
import { getCurrentUser } from "./api";
import type { Department } from "./interfaces/modelsTypes/department";

interface UserData {
	surname: string;
	name: string;
	patronymic: string;
	role_id: number;
	department_id: number;
	department: Department;
}

export const useAuth = () => {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await getCurrentUser();
				setUser(res.data);
				setError(null);
			} catch (err) {
				setUser(null);
				setError(err instanceof Error ? err : new Error("Ошибка"));
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return { user, loading, error };
};
