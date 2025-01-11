import { api } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchIngredients = () => {
  return useQuery({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const response = await api.get("/ingredients/");
      return response.data;
    },
    onError: () => {
      toastTrigger("Failed to fetch categories", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};
