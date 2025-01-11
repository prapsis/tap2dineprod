import { api } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchAddons = () => {
  return useQuery({
    queryKey: ["add-ons"],
    queryFn: async () => {
      const response = await api.get("/add-ons/");
      return response.data;
    },
    onError: () => {
      toastTrigger("Failed to fetch addons", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};
