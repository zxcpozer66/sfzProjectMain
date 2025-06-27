import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  Box,
  Button,
  IconButton,
  Input,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import {useState } from "react";
import type {  HeadCell, Role, UserData } from "../../../interfaces/types";
import AlertDialog from "../../modals/AlertDialog";
import { useTablePaginationAndSort } from "../../../hooks/useTablePaginationAndSort";
import type { Department } from "../../../interfaces/modelsTypes/department";

interface UserTableProps {
  users: UserData[];
  departments: Department[];
  currentUser: UserData;
  roles: Role[];
  onEdit: (id: number, data: Partial<UserData>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

let headCells: readonly HeadCell[] = [
  { id: "username", align: "left", label: "Username" },
  { id: "name", align: "left", label: "Имя" },
  { id: "surname", align: "left", label: "Фамилия" },
  { id: "patronymic", align: "left", label: "Отчество" },
  { id: "department", align: "left", label: "Департамент" },
  { id: "total_work_hours", align: "center", label: "Часов отработано" },
  { id: "available_hours", align: "center", label: "Оставшиеся часы" },
];

export function UserTable({
  users,
  departments,
  currentUser,
  roles,
  onEdit,
  onDelete,
  isLoading,
}: UserTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<UserData> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const {
      order,
      orderBy,
      page,
      rowsPerPage,
      visibleRows,
      handleRequestSort,
      handleChangePage,
      handleChangeRowsPerPage,
    } = useTablePaginationAndSort(users, "id");

  const handleRowDoubleClick = (row: UserData) => {
    if (editingId === row.id) {
      cancelEditing();
      return;
    }
    if (editingId !== null) {
      cancelEditing();
    }
    setEditingId(row.id);
    setEditData({
      name: row.name,
      surname: row.surname,
      patronymic: row.patronymic,
      department_id: row.department_id,
      role_id: row.role_id
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof UserData
  ) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleDepartmentChange = (e: any) => {
    if (!editData) return;
    setEditData({ ...editData, department_id: Number(e.target.value) });
  };

  const handleRoleChange = (e: any) => {
    if (!editData) return;
    setEditData({ ...editData, role_id: Number(e.target.value) });
  };

  const handleSave = async () => {
    if (editingId === null || !editData) return;
    await onEdit(editingId, editData);
    cancelEditing();
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingId === null) return;
    await onDelete(deletingId);
    setIsDialogOpen(false);
    setDeletingId(null);
    if (editingId === deletingId) cancelEditing();
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setDeletingId(null);
  };

 

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {!isLoading && currentUser.role.title === "ceo" && (
                  <TableCell align="center">Роль</TableCell>
                )}
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => {
                const isEditing = editingId === row.id;
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    onDoubleClick={() => handleRowDoubleClick(row)}
                    sx={{
                      backgroundColor: isEditing ? "#f0f7ff" : "inherit",
                      "&:hover": {
                        backgroundColor: isEditing ? "#e3f2fd" : "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.username}
                    </TableCell>
                    <TableCell align="left">
                      {isEditing ? (
                        <Input
                          value={editData?.name || ""}
                          onChange={(e) => handleInputChange(e, "name")}
                          fullWidth
                          autoFocus
                          onDoubleClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        row.name
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isEditing ? (
                        <Input
                          value={editData?.surname || ""}
                          onChange={(e) => handleInputChange(e, "surname")}
                          onDoubleClick={(e) => e.stopPropagation()}
                          fullWidth
                        />
                      ) : (
                        row.surname
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isEditing ? (
                        <Input
                          value={editData?.patronymic || ""}
                          onChange={(e) => handleInputChange(e, "patronymic")}
                          onDoubleClick={(e) => e.stopPropagation()}
                          fullWidth
                        />
                      ) : (
                        row.patronymic || "н/д"
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {isEditing ? (
                        <Select
                          value={editData?.department_id || 0}
                          onChange={handleDepartmentChange}
                          fullWidth
                          variant="outlined"
                          onDoubleClick={(e) => e.stopPropagation()}
                        >
                          {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                              {dept.title}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        row.department
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.total_work_hours}
                    </TableCell>
                    <TableCell align="center">
                      {row.available_hours}
                    </TableCell>
                    {(!isLoading && currentUser.role.title === "ceo") && (
                      <TableCell align="center">
                        {isEditing ? (
                          <Select
                            value={editData?.role_id || 0}
                            onChange={handleRoleChange}
                            fullWidth
                            variant="outlined"
                            onDoubleClick={(e) => e.stopPropagation()}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role.id} value={role.id}>
                                {role.title}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          roles.find(r => r.id === row.role_id)?.title || row.role_id
                        )}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {isEditing ? (
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={handleSave}
                          size="small"
                        >
                          Сохранить
                        </Button>
                      ) : (
                        <IconButton
                          color="error"
                          onClick={(e) => handleDeleteClick(e, row.id)}
                          disabled={isLoading}
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage="Количество записей:"
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
        />
      </Paper>
      <AlertDialog
        open={isDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        textMessage="Вы уверены, что хотите удалить пользователя?"
      />
    </Box>
  );
}