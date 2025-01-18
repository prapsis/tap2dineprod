import { api, noAuthApi } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useFetchOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await noAuthApi.get("/orders/");
            return response.data;
        },
        onError: () => {
            toastTrigger("Failed to fetch categories", undefined, "error");
        },
        refetchOnWindowFocus: true,
    });
};

export const useFetchSingleOrder = ({ orderId }: { orderId: string }) => {
    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: async () => {
            const response = await api.get(`/orders/${orderId}/`);
            return response.data;
        },
        onError: () => {
            toastTrigger("Failed to fetch categories", undefined, "error");
        },
        refetchOnWindowFocus: true,
    });
};