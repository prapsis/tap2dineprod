import { api } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";
import { TTableType } from "../../schemas/table";

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();
  const addIngredientMutation = useMutation({
    mutationFn: (data: TTableType) => api.post("/tables/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toastTrigger("Table added successfully", undefined, "success");
    },
    onError: () => {
      toastTrigger("Table add failed", undefined, "error");
    },
  });
  return addIngredientMutation;
};

export const useEditTableMutation = ({
  initiatorName,
}: {
  initiatorName: string;
}) => {
  const queryClient = useQueryClient();
  const editIngredientMutation = useMutation({
    mutationFn: (data: TTableType) =>
      api.patch(`/tables/${initiatorName}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      toastTrigger("Table edited successfully", undefined, "success");
    },
    onError: (data) => {
      console.log(data);
      toastTrigger("Table edit failed", undefined, "error");
    },
  });
  return editIngredientMutation;
};
