import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
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

	return children;
};
