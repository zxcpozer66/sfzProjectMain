import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addApplication, addUser } from "./../../api";
import SearchSelect from "./../SearchSelect";
import type { Department } from "../../interfaces/modelsTypes/department";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface AddRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  refetchApplications: () => void;
  departments: Department[];
}

interface ApplicationFormData {
  appeal_title: string;
  description_problem: string;
  department_id: string;
  user_id: string;
}

interface NewUserData {
  surname: string;
  name: string;
  patronymic: string;
  department_id?: number;
}

export const AddRequestModal: React.FC<AddRequestModalProps> = ({
  open,
  onClose,
  onSubmit,
  refetchApplications,
  departments,
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    appeal_title: "",
    description_problem: "",
    department_id: "",
    user_id: "",
  });

  const [showDepartmentSelect, setShowDepartmentSelect] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: String(value) }));
  };

  const handleClose = () => {
    onClose();
    setShowDepartmentSelect(false);
    setNewUser(false);
    setNewUserData(null);
    setFormData({
      appeal_title: "",
      description_problem: "",
      department_id: "",
      user_id: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let userId = formData.user_id;

      if (newUser && newUserData && formData.department_id) {
        if (!newUserData.surname || !newUserData.name || !newUserData.patronymic) {
          throw new Error("All user fields (surname, name, patronymic) are required");
        }

        const userResponse = await addUser({
		surname: newUserData.surname,
		name: newUserData.name,
		patronymic: newUserData.patronymic,
		...(formData.department_id && { department_id: Number(formData.department_id) }),
		});

        userId = (
          (userResponse as any).data?.id ||
          (userResponse as any).id ||
          (userResponse as any).user?.id ||
          ""
        ).toString();

        if (!userId) {
          throw new Error("Failed to get user ID from response");
        }
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const applicationData = {
        appeal_title: formData.appeal_title,
        description_problem: formData.description_problem,
        department_id: Number(formData.department_id),
        user_id: Number(userId),
      };

      const applicationResponse = await addApplication(applicationData);
      onSubmit(applicationResponse.data || applicationResponse);
      refetchApplications();
      handleClose();
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Добавить новое обращение
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Обращение"
            name="appeal_title"
            value={formData.appeal_title}
            onChange={handleChange}
            required
            multiline
            rows={1}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Описание проблемы"
            name="description_problem"
            value={formData.description_problem}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />

          <SearchSelect
            setShowDepartmentSelect={setShowDepartmentSelect}
            setNewUser={setNewUser}
            setNewUserData={setNewUserData as any}
            formData={{ 
              user_id: formData.user_id,
              department_id: Number(formData.department_id)
            }}
            setFormData={(data: any) => {
              setFormData(prev => ({
                ...prev,
                user_id: data.user_id?.toString() || "",
                department_id: data.department_id?.toString() || ""
              }));
            }}
          />

          {showDepartmentSelect && newUser && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="department-select-label">Отдел</InputLabel>
              <Select
                labelId="department-select-label"
                name="department_id"
                value={formData.department_id}
				  /* @ts-ignore */
                onChange={handleChange}
                label="Отдел"
                required
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} sx={{ mr: 1 }}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Добавить"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};