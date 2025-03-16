import { api } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";
import { TIngredientType } from "../../schemas/ingredient";

export const useAddIngredientMutation = () => {
  const queryClient = useQueryClient();
  const addIngredientMutation = useMutation({
    mutationFn: (data: Omit<TIngredientType, "unit">) => api.post("/ingredients/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toastTrigger("Category added successfully", undefined, "success");
    },
    onError: (data) => {
      console.log(data);
      toastTrigger("Category add failed", undefined, "error");
    },
  });
  return addIngredientMutation;
};

export const useEditIngredientMutation = ({
  initiatorName,
}: {
  initiatorName: string;
}) => {
  const queryClient = useQueryClient();
  const editIngredientMutation = useMutation({
    mutationFn: (data: Omit<TIngredientType,"unit">) =>
      api.patch(`/ingredients/${initiatorName}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
      toastTrigger("Ingredient edited successfully", undefined, "success");
    },
    onError: (data) => {
      console.log(data);
      toastTrigger("Ingredient edit failed", undefined, "error");
    },
  });
  return editIngredientMutation;
};
