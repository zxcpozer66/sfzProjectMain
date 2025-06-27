import { Button, CircularProgress, Table, TableBody, TableCell, TableRow } from "@mui/material";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { editApplication } from "../../../../api";
import type { Detail } from "../../../../interfaces/componentTypes/details";
import type { DetailTableProps } from "../../../../interfaces/otherTypes/detailTableProps";
import {
  detailFields,
  labelMap,
  mapDetailToRequest,
} from "../../../../utils/detailMapping";
import { useRequestForm } from "../../../RequestFormContext";
import { EditableCell } from "./cell/editCell";
import type { RequestData } from "../../../../interfaces/api/requestData";

export const DetailTable: FC<DetailTableProps> = ({
  reactionOptions,
  notationOptions,
}) => {
  const { formData, editMode, setFormData } = useRequestForm();
  const [initialFormData, setInitialFormData] = useState<RequestData>(formData);
  const [isLoading, setIsLoading] = useState<"start" | "end" | false>(false);

  useEffect(() => {
    setInitialFormData(formData);
  }, []);

  useEffect(() => {
    if (!editMode) {
      setFormData(initialFormData);
    }
  }, [editMode, initialFormData, setFormData]);

  
  const detailData: Detail = {
    startTime: formData.start_time
      ? new Date(formData.start_time).toISOString()
      : undefined,
    endTime: formData.end_time
      ? new Date(formData.end_time).toISOString()
      : undefined,
    descriptionProblem: formData.description_problem || "",
    descriptionTask: formData.description_task || "",
    answer: formData.answer || "",
    typeReaction: formData.reaction_type?.title || "",
    order_application: formData.order_application || "",
    notation: formData.notation?.title || "",
    setStartTime: formData.setStartTime || false,
    setEndTime: formData.setEndTime || false,
    typeReactionId: formData.reaction_type?.id,
    notationId: formData.notation?.id,
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | Date | null
  ) => {
    let update: Partial<RequestData> = {
      [field]: value instanceof Date ? value.toISOString() : value,
    };

    if (field === "type_reaction_id" && typeof value === "number") {
      const reaction = reactionOptions.find((r) => r.id === value);
      if (reaction) {
        update.reaction_type = { id: reaction.id, title: reaction.title };
      }
    }

    if (field === "notation_id" && typeof value === "number") {
      const notation = notationOptions.find((n) => n.id === value);
      if (notation) {
        update.notation = { id: notation.id, title: notation.title };
      }
    }

    setFormData((prev) => ({ ...prev, ...update }));
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return null;
    try {
      return new Date(time).toLocaleString();
    } catch {
      return time;
    }
  };

  const handleTimeButtonClick = async (type: "start" | "end") => {
  const timeField = type === "start" ? "start_time" : "end_time";
  const setTimeField = type === "start" ? "set_start_time" : "set_end_time";
  const currentTime = new Date().toISOString();

  setIsLoading(type);

  const updatePayload: Partial<RequestData> = {
    [timeField]: currentTime,
    [setTimeField]: true
  };

  try {
    setFormData(prev => ({
      ...prev,
      ...updatePayload
    }));

    await editApplication(formData.id, updatePayload);
  } catch (error) {
    console.error("Ошибка при сохранении времени:", error);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <Table size="medium" aria-label="details">
      <TableBody>
        {detailFields.map((key) => (
          <TableRow key={key}>
            <TableCell sx={{ width: 200 }}>{labelMap[key]}</TableCell>
            <TableCell>
              {key === "startTime" ? (
                formatTime(detailData.startTime) || (
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleTimeButtonClick("start")}
                    disabled={!!isLoading}
                    startIcon={isLoading === "start" ? <CircularProgress size={16} /> : null}
                  >
                    {isLoading === "start" ? "Сохранение..." : "Начать работу"}
                  </Button>
                )
              ) : key === "endTime" ? (
                formatTime(detailData.endTime) || (
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={() => handleTimeButtonClick("end")}
                    disabled={!detailData.startTime || !!isLoading}
                    startIcon={isLoading === "end" ? <CircularProgress size={16} /> : null}
                  >
                    {isLoading === "end" ? "Сохранение..." : "Закончить работу"}
                  </Button>
                )
              ) : (
                <EditableCell
                  keyName={key}
                  value={detailData[key]}
                  editMode={editMode}
                  reactionOptions={reactionOptions}
                  notationOptions={notationOptions}
                  onChange={(newValue) =>
                    handleInputChange(mapDetailToRequest[key], newValue)
                  }
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};