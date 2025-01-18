import { noAuthApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const response = await noAuthApi.get("/tables/");
      return response.data;
    },
    onError: () => {
      toastTrigger("Failed to fetch tables", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};
