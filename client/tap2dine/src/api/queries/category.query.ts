import { noAuthApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await noAuthApi.get("/categories/");
      return response.data;
    },
    onError: () => {
      toastTrigger("Failed to fetch categories", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};

export const useFetchDishesByCategory = ({ categoryId }: { categoryId: string }) => {
  return useQuery({
    queryKey: ["dishes",categoryId],
    queryFn: async () => {
      if (!categoryId) {
        return []; // Return empty data if no categoryId is provided
      }
      const response = await noAuthApi.get(`/dishes/category/${categoryId}/dishes/`);
      return response.data;
    },    onError: () => {
      toastTrigger("Failed to fetch dishes", undefined, "error");
    },
    enabled: !!categoryId,
    refetchOnWindowFocus: true,
  });
};
