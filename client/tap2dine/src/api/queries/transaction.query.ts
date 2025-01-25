import { api } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchTransactions = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await api.get("/transactions/");
            return response.data;
        },
        onError: () => {
            toastTrigger("Failed to fetch transactions", undefined, "error");
        },
        refetchOnWindowFocus: true,
    });
};
