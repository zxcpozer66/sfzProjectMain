import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
} from "react";
import { editApplication } from "../api";
import type { RequestData } from "../interfaces/api/requestData";

interface RequestFormContextType {
  formData: RequestData;
  setFormData: Dispatch<SetStateAction<RequestData>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
}

const RequestFormContext = createContext<RequestFormContextType | undefined>(
  undefined,
);

export const RequestFormProvider: FC<{
  children: ReactNode;
  initialData: RequestData;
}> = ({ children, initialData }) => {
  const [formData, setFormData] = useState<RequestData>(initialData);
  const [editMode, setEditMode] = useState(false);

  const handleSave = async () => {
    setEditMode(false);
    if (!formData) return;

    const payload = {
      ...formData,
      user_id: formData.user?.id || formData.id,
      master_id: formData.master?.id || formData.id,
      user: formData.user?.id,
      master: formData.master?.id,
      department: formData.department?.id,
      reaction_type: formData.type_reaction_id,
      notation: formData.notation_id,
      description_task: formData.description_task,
      descriptionProblem: formData.description_problem
    };

    try {
      await editApplication(formData.id, payload);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      throw error;
    }
  };

  return (
    <RequestFormContext.Provider
      value={{ formData, setFormData, editMode, setEditMode, handleSave }}
    >
      {children}
    </RequestFormContext.Provider>
  );
};

export const useRequestForm = () => {
  const context = useContext(RequestFormContext);
  if (!context) {
    throw new Error("useRequestForm must be used within a RequestFormProvider");
  }
  return context;
};