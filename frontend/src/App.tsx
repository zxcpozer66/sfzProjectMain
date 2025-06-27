import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { UsersPage } from "./pages/UsersPage";
import { VacationsPage } from "./pages/VacationsPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleProtectedRoute } from "./RoleProtectedRoute";
import { DepartmentsPage } from "./pages/DepartmentsPage";

function App() {
	
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="registration" element={
						
						<RegistrationPage />
					} 
						/>
					<Route path="/" element={<Layout />}>
						<Route
							index
							element={
								<ProtectedRoute>
									<HomePage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="users"
							element={
								<RoleProtectedRoute allowedRoles={[1, 2]}>
									<UsersPage />
								</RoleProtectedRoute>
							}
						/>
						<Route
							path="vacations"
							element={
								<RoleProtectedRoute allowedRoles={[1, 2]}>
									<VacationsPage />
								</RoleProtectedRoute>
							}
						/>
						<Route
							path="departments"
							element={
								<RoleProtectedRoute allowedRoles={[1]}>
									<DepartmentsPage />
								</RoleProtectedRoute>
							}
						/>
					</Route>

					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
