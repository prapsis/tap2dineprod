import { api } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";
import { TDishType } from "../../schemas/dish";

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();
  const addDishMutation = useMutation({
    mutationFn: (data: TDishType) => api.post("/dishes/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toastTrigger("Dish added successfully", undefined, "success");
    },
    onError: () => {
      toastTrigger("Dish add failed", undefined, "error");
    },
  });
  return addDishMutation;
};

export const useEditDishMutation = ({
  initiatorName,
}: {
  initiatorName: string;
}) => {
  const queryClient = useQueryClient();
  const editDishMutation = useMutation({
    mutationFn: (data: TDishType) =>
      api.patch(`/dishes/${initiatorName}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toastTrigger("Dish edited successfully", undefined, "success");
    },
    onError: (data) => {
      console.log(data);
      toastTrigger("Dish edit failed", undefined, "error");
    },
  });
  return editDishMutation;
};
