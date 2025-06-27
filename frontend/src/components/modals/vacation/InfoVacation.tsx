import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Input, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useState, type FC } from "react";
import AlertDialog from "../AlertDialog";
import { formatHours } from "../../../utils/utils";
import { deleteVacation } from "../../../api";
import type { Vacation } from "../../../interfaces/modelsTypes/vacation";
import { generateVacationRequestPDF } from "../../pdf/GenerateVacationRequestPDF";
import { useAuth } from "../../../useAuth";
import type { AvailableHours } from "../../../interfaces/otherTypes/availableHours";

interface iProps {
  vacations: Vacation[];
  availableHours: AvailableHours;
  rangeData: number;
  fetchAvailableHours: () => void;
  fetchVacation: () => void;
  inputValue: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InfoVacation: FC<iProps> = ({
  vacations,
  availableHours,
  rangeData,
  fetchAvailableHours,
  fetchVacation,
  inputValue,
  handleInputChange
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { user } = useAuth();

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingId === null) return;
    try {
      await deleteVacation(deletingId);
      fetchVacation();
      fetchAvailableHours();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setIsDialogOpen(false);
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setDeletingId(null);
  };

  const handleDownload = (vacation: Vacation) => {
    generateVacationRequestPDF({
      employeeName: `${user?.surname} ${user?.name} ${user?.patronymic}`,
      department: user?.department?.title,
      startDate: vacation.start_date,
      endDate: vacation.end_date,
      applicationDate: vacation.created_at.split("T")[0],
    });
  };


  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "41vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mr: 9,
          mt: 10,
          mb: 7,
        }}
      >
        <TableContainer component={Paper} sx={{ overflowX: "hidden" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
              }}
            >
              <TableRow>
                <TableCell align="center">Дата начала</TableCell>
                <TableCell align="center">Дата конца</TableCell>
                <TableCell align="center">Статус</TableCell>
                <TableCell align="center">Загрузить</TableCell>
                <TableCell align="center">Удалить</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vacations.map((vacation) => (
                <TableRow
                  key={vacation.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{vacation.start_date}</TableCell>
                  <TableCell align="center">{vacation.end_date}</TableCell>
                  <TableCell align="center">{vacation.status.title}</TableCell>

                  <TableCell align="center">
                    {vacation.status.id == 1 && (
                      <FileDownloadIcon
                        color="primary"
                        titleAccess="Удалить"
                        onClick={() => handleDownload(vacation)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {vacation.status.id == 1 && (
                      <DeleteForeverIcon
                        color="error"
                        titleAccess="Удалить"
                        onClick={(e) => handleDeleteClick(e, vacation.id)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 2,
            mt: 3,
          }}
        >
          <Typography variant="body2">
            Необходимо:
            <Input
              sx={{
                width: "60px",
                paddingLeft: "5px",
                "& input": {
                  textAlign: "center",
                },
              }}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              size="small"
            />
            {formatHours(rangeData).split(" ")[1]}
          </Typography>
          <Typography variant="body2">
            Доступно: {formatHours(availableHours.available_hours)}
          </Typography>
        </Box>
      </Box>
      <AlertDialog
        open={isDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        textMessage={"Заявка на отпуск будет удаленна из списка на подачу"}
      />
    </>
  );
};
