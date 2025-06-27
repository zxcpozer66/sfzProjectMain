import { Box, Modal } from "@mui/material";
import { ru } from "date-fns/locale/ru";
import React, { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AddVacation } from "./vacation/AddVacation";
import { InfoVacation } from "./vacation/InfoVacation";
import { addVacation, getAvailableHours, myVacation } from "../../api";
import type { AvailableHours } from "../../interfaces/otherTypes/availableHours";
import type { Vacation } from "../../interfaces/modelsTypes/vacation";

registerLocale("ru", ru);

interface AddVacationModal {
  open: boolean;
  onClose: () => void;
}

export const AddVacationModal: React.FC<AddVacationModal> = ({
  open,
  onClose,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [availableHours, setAvailableHours] = useState<AvailableHours>({
    total_work_hours: 0,
    total_vacation_hours: 0,
    available_hours: 0,
  });

  const hours_work = 8; // рабочих часов за день
  const partsDay = 24 / hours_work;

  let rangeData =
    startDate != null && endDate != null
      ? (Number(endDate) - Number(startDate)) / (1000 * 60 * 60 * partsDay) +
        hours_work
      : 0;
  const fetchAvailableHours = async () => {
    const res = await getAvailableHours();
    setAvailableHours(res.data);
  };

  useEffect(() => {
    fetchAvailableHours();
  }, []);

  useEffect(() => {
    if (open) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [open]);

  const [vacations, setVacation] = useState<Vacation[]>([]);

  const fetchVacation = async () => {
    const res = await myVacation();

    setVacation(res.data);
  };

  useEffect(() => {
    fetchVacation();
  }, []);

  const [isDisabled, setIsDisabled] = useState(false);
  const [inputValue, setInputValue] = useState(rangeData);

  const handleSubmit = async () => {
    if (startDate === null || endDate === null) {
      console.error("Даты не выбраны!");
      return;
    }

    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 1);

    const rangeDate = {
      startDate: newStartDate,
      endDate: newEndDate,
      hours: inputValue
    };

    try {
      await setIsDisabled(true);
      await addVacation(rangeDate);
      await fetchAvailableHours();
      await setIsDisabled(false);
      await fetchVacation();
    } catch (error) {
      setIsDisabled(false);
      console.error("Ошибка при создании отпуска:", error);
    }
  };


  useEffect(() => {
    setInputValue(rangeData);
  }, [rangeData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === "") {
      setInputValue(0);
      return;
    }

    const value = parseInt(rawValue, 10);

    if (value > rangeData) {
      setInputValue(rangeData);
      return;
    }

    if (value < rangeData / 8) {
      setInputValue(rangeData / 8);
      return;
    }

    setInputValue(value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          outline: "none",
          maxWidth: "95vw",
          width: "fit-content",
          display: "flex",
        }}
      >
        <AddVacation
          rangeData={rangeData}
          availableHours={availableHours}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onClose={onClose}
          handleSubmit={handleSubmit}
          isDisabled={isDisabled}
        />
        <InfoVacation
          vacations={vacations}
          fetchAvailableHours={fetchAvailableHours}
          availableHours={availableHours!}
          rangeData={rangeData}
          fetchVacation={fetchVacation}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
        />
      </Box>
    </Modal>
  );
};

