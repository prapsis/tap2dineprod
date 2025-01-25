import { api } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useTestAuthenticate = () => {
  return useQuery({
    queryFn: async () => {
        const response = await api.get("/test-auth/");
        return response.data;
    },
    onError: () => {
      toastTrigger("Failed to authenticate.", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};
