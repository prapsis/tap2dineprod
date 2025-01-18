import { noAuthApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchDishes = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const response = await noAuthApi.get("/dishes/");
      return response.data;
    },
    onError: () => {
      toastTrigger("Failed to fetch dishes", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};

export const useFetchSingleDish = ({
  queryParams,
}: {
  queryParams: string;
}) => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const response = await noAuthApi.get(`/dishes/${queryParams}/`);
      return response.data;
    },
    onError: () => {
      toastTrigger("Failed to fetch dishes", undefined, "error");
    },
    refetchOnWindowFocus: true,
  });
};
