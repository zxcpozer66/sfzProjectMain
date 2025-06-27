import { Box } from "@mui/material";
import { AddDepartments } from "../components/AddDepartment";
import { DepartmentTable } from "../components/tables/departments/DepartmentsTable";
import { useState } from "react";
import type { Department } from "../interfaces/modelsTypes/department";

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  
  return (
  <Box sx={{display: "flex",  backgroundColor: 'white', padding: '50px',  justifyContent: "space-evenly"}}>
        <AddDepartments departments={departments} setDepartments={setDepartments}/>
        <DepartmentTable departments={departments} setDepartments={setDepartments}/>
  </Box>)
};
