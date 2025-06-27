import { Box, Button, Typography } from "@mui/material";
import { Calendar } from "../Calendar";
import { type FC } from "react";
import type { AvailableHours } from "../../../interfaces/otherTypes/availableHours";


interface iProps {
  rangeData: number;
  availableHours: AvailableHours;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  onClose: () => void;
  handleSubmit: () => void;
  isDisabled: boolean;
}

export const AddVacation: FC<iProps> = ({
  rangeData,
  availableHours ,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onClose,
  handleSubmit,
  isDisabled
}) => {
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };



  return (
    <div>
      <Typography variant="h6" sx={{ p: 3, pb: 0, textAlign: "center" }}>
        Подать заявку
      </Typography>
      <Calendar
        startDate={startDate}
        endDate={endDate}
        handleDateChange={handleDateChange}
      />
      <Box
        sx={{
          p: 3,
          pt: 0,
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 130 }}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={
            isDisabled ||
            startDate === null ||
            endDate === null ||
            rangeData > availableHours.available_hours
          }
          sx={{ minWidth: 130 }}
        >
          Создать
        </Button>
      </Box>
    </div>
  );
};
