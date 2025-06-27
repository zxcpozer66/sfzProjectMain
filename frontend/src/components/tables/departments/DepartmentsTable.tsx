import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { useEffect, useState, type MouseEvent } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AlertDialog from "../../modals/AlertDialog";
import {
  deleteDepartment,
  editDepartment,
  getUsers,
  getDepartments,
} from "../../../api";
import type { Department } from "../../../interfaces/modelsTypes/department";
import { Button, Input, MenuItem, Select } from "@mui/material";
import type { User } from "../../../interfaces/modelsTypes/user";
import { useTablePaginationAndSort } from "../../../hooks/useTablePaginationAndSort";

interface HeadCell {
  id: keyof TableDepartment;
  label: string;
  align: "left" | "center" | "right";
  padding: "none" | "normal";
  sortable: boolean;
}

interface TableDepartment {
  id?: number;
  title?: string;
  chief?: string;
  parent?: string;
  delete_id?: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "title",
    label: "Наименование",
    align: "left",
    padding: "normal",
    sortable: true,
  },
  {
    id: "chief",
    label: "Начальник",
    align: "center",
    padding: "normal",
    sortable: true,
  },
  {
    id: "parent",
    label: "Главный отдел",
    align: "center",
    padding: "normal",
    sortable: true,
  },
  {
    id: "delete_id",
    label: "",
    align: "center",
    padding: "normal",
    sortable: false,
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: MouseEvent<unknown>,
    property: keyof TableDepartment
  ) => void;
  order: Order;
  orderBy: string;
}

type Order = "asc" | "desc";

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof TableDepartment) => (event: MouseEvent<unknown>) => {
      if (headCells.find((cell) => cell.id === property)?.sortable) {
        onRequestSort(event, property);
      }
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.padding}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export const DepartmentTable = ({
  departments,
  setDepartments,
}: {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
}) => {
  const tableData: TableDepartment[] = departments.map((dept) => ({
    id: dept.id,
    title: dept.title,
    chief: dept.chief
      ? `${dept.chief.surname} ${dept.chief.name} ${dept.chief.patronymic}`
      : "н/д",
    parent: dept.parent_department ? dept.parent_department.title : "н/д",
    delete_id: "",
  }));

  const {
    order,
    orderBy,
    page,
    rowsPerPage,
    visibleRows,
    handleRequestSort,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTablePaginationAndSort(tableData, "id");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{
    title?: string;
    chief_id?: number;
    parent_id?: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  const handleRowDoubleClick = (row: TableDepartment) => {
    const dept = departments.find((d) => d.id === row.id);
    if (!dept) return;

    if (editingId === row.id) {
      cancelEditing();
      return;
    }

    setEditingId(row.id!);
    setEditData({
      title: dept.title,
      chief_id: dept.chief?.user_id ?? undefined,
      parent_id: dept.parent_department?.id ?? undefined,
    });
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
    try {
      await deleteDepartment(deletingId);
      setDepartments((prev) => prev.filter((d) => d.id !== deletingId));
    } catch (error) {
      console.error("Ошибка при удалении отдела:", error);
    } finally {
      setIsDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (editingId === null || !editData) return;
    try {
      await editDepartment(editingId, editData);

      const updatedDepartments = await getDepartments();
      setDepartments(updatedDepartments.data);
    } catch (error) {
      console.error("Ошибка при сохранении отдела:", error);
    } finally {
      cancelEditing();
    }
  };

  return (
    <>
      <Box sx={{ width: "60%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((row) => {
                  const isEditing = editingId === row.id;
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{ cursor: "pointer" }}
                      onDoubleClick={() => handleRowDoubleClick(row)}
                    >
                      {headCells.map((cell) => (
                        <TableCell
                          key={cell.id}
                          align={cell.align}
                          padding={cell.padding}
                        >
                          {cell.id === "delete_id" ? (
                            isEditing ? (
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={handleSave}
                                size="small"
                              >
                                Сохранить
                              </Button>
                            ) : (
                              <DeleteForeverIcon
                                color="error"
                                titleAccess="Удалить"
                                onClick={(e) => handleDeleteClick(e, row.id!)}
                                style={{ cursor: "pointer" }}
                              />
                            )
                          ) : isEditing ? (
                            cell.id === "title" ? (
                              <Input
                                value={editData?.title || ""}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...(prev || {}),
                                    title: e.target.value,
                                  }))
                                }
                              />
                            ) : cell.id === "chief" ? (
                              <Select
                                fullWidth
                                value={editData?.chief_id ?? ""}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...(prev || {}),
                                    chief_id: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  }))
                                }
                              >
                                <MenuItem value="">н/д</MenuItem>
                                {users.map((c) => (
                                  <MenuItem key={c.id} value={c.id}>
                                    {`${c.surname} ${c.name} ${c.patronymic}`}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : cell.id === "parent" ? (
                              <Select
                                fullWidth
                                value={editData?.parent_id ?? ""}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...(prev || {}),
                                    parent_id: e.target.value
                                      ? Number(e.target.value)
                                      : undefined,
                                  }))
                                }
                              >
                                <MenuItem value="">н/д</MenuItem>
                                {departments
                                  .filter((d) => d.id !== editingId)
                                  .map((d) => (
                                    <MenuItem key={d.id} value={d.id}>
                                      {d.title}
                                    </MenuItem>
                                  ))}
                              </Select>
                            ) : (
                              row[cell.id]
                            )
                          ) : (
                            row[cell.id]
                          )}
                        </TableCell>
                      ))}
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
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} из ${count}`
            }
          />
        </Paper>
      </Box>
      <AlertDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        textMessage="Вы уверены что хотите удалить отдел?"
      />
    </>
  );
};
