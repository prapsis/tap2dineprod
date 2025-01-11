import { api } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";
import { TCategoryType } from "../../schemas/category";

export const useAddAddonMutation = () => {
  const queryClient = useQueryClient();
  const addAddonMutation = useMutation({
    mutationFn: (data: TCategoryType) => api.post("/add-ons/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add-ons"] });
      toastTrigger("Addon added successfully", undefined, "success");
    },
    onError: (data) => {
      console.log(data);
      toastTrigger("Addon add failed", undefined, "error");
    },
  });
  return addAddonMutation;
};

export const useEditAddonMutation = ({
  initiatorName,
}: {
  initiatorName: string;
}) => {
  const queryClient = useQueryClient();
  const editAddonMutation = useMutation({
    mutationFn: (data: TCategoryType) =>
      api.patch(`/add-ons/${initiatorName}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add-ons"] });
      toastTrigger("Category edited successfully", undefined, "success");
    },
    onError: (data) => {
      console.log(data);
      toastTrigger("Category edit failed", undefined, "error");
    },
  });
  return editAddonMutation;
};
