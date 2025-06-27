import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { CircularProgress, Box } from "@mui/material";

interface RoleProtectedRouteProps {
	children: ReactNode;
	allowedRoles: number[];
}

export const RoleProtectedRoute = ({
	children,
	allowedRoles,
}: RoleProtectedRouteProps) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress size={60} />
			</Box>
		);
	}

	const isRegistered =
		user?.name && user?.surname && user?.patronymic && user?.department_id;

	if (!isRegistered) {
		return <Navigate to="/registration" />;
	}

	if (!allowedRoles.includes(user.role_id)) {
		return <Navigate to="/" />;
	}

	return children;
};
