import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { addDepartment, getDepartments, getUsers } from "../api";
import type { User } from "../interfaces/modelsTypes/user";
import type { Department } from "../interfaces/modelsTypes/department";

interface AddDepartmentsProps {
  departments?: Department[];
  setDepartments: (departments: Department[] | ((prev: Department[]) => Department[])) => void;
}

export const AddDepartments = ({ departments, setDepartments }: AddDepartmentsProps) => {
  const [formData, setFormData] = useState({
    title: "",
    parent_id: null,
    cheif_id: null,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, usersRes] = await Promise.all([
          getDepartments(),
          getUsers()
        ]);
        setDepartments(deptRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setError("Не удалось загрузить необходимые данные");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value ? Number(value) : null 
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const response = await addDepartment(formData);
    const newData = response.data.data;

    const newChiefUser = newData.users?.[0] || null;

    setDepartments((prevDepartments: Department[]) => {
      const updatedDepartments = prevDepartments.map((dept) => {
        if (newChiefUser && dept.chief?.user_id === newChiefUser.id) {
          return { ...dept, chief: null };
        }
        return dept;
      });

      const newDepartment: Department = {
        id: newData.id,
        title: newData.title,
        parent_department: updatedDepartments.find((d) => d.id === formData.parent_id) || null,
        chief: newChiefUser
          ? {
              name: newChiefUser.name,
              surname: newChiefUser.surname,
              patronymic: newChiefUser.patronymic,
              user_id: newChiefUser.id,
            }
          : null,
      };

      return [...updatedDepartments, newDepartment];
    });

    setFormData({ title: "", parent_id: null, cheif_id: null });
  } catch (error) {
    console.error("Ошибка при создании отдела:", error);
    setError("Не удалось создать отдел");
  } finally {
    setIsSubmitting(false);
  }
};




  const handleReset = () => {
    setFormData({ title: "", parent_id: null, cheif_id: null });
  };

  return (
    <Box sx={{ width: 500 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Добавить отдел
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Название отдела"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="parent-department-label">Родительский отдел</InputLabel>
          <Select
            labelId="parent-department-label"
            name="parent_id"
            value={formData.parent_id ?? ""}
            onChange={handleSelectChange}
            label="Родительский отдел"
          >
            <MenuItem value="">Нет (основной отдел)</MenuItem>
            {departments?.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                {department.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="chief-label">Руководитель отдела</InputLabel>
          <Select
            labelId="chief-label"
            name="cheif_id"
            value={formData.cheif_id ?? ""}
            onChange={handleSelectChange}
            label="Руководитель отдела"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {`${user.surname} ${user.name} ${user.patronymic}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button 
            type="button" 
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Очистить
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Сохранение..." : "Добавить"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};