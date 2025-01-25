import { api, noAuthApi } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";
import { TOrderType } from "../../schemas/order";
import { OrderStatus } from "../../pages/auth-pages/orders/[orderid]/page";


export const useAddOrderMutation = () => {
    const queryClient = useQueryClient();
    const addOrderMutation = useMutation({
        mutationFn: (data: TOrderType) => noAuthApi.post("/orders/", data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toastTrigger("Order created successfully", undefined, "success");
        },
        onError: () => {
            toastTrigger("Order add failed", undefined, "error");
        },
    });
    return addOrderMutation;
};

export const useUpdateOrderStatusMutation = ({ orderId }: { orderId: string }) => {
    const queryClient = useQueryClient();
    const updateOrderStatusMutation = useMutation({
        mutationFn: (data: { status: OrderStatus }) =>
            api.patch(`/orders/${orderId}/update_status/`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toastTrigger("Order status updated successfully", undefined, "success");
        },
        onError: () => {
            toastTrigger("Order status update failed", undefined, "error");
        },
    });
    return updateOrderStatusMutation;
}