import { api } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";

export const useCheckoutMutation = ({ orderId }: { orderId: string }) => {
    const queryClient = useQueryClient();
    const checkoutMutation = useMutation({
        mutationFn: (data: any) => api.patch(`orders/${orderId}/checkout/`, data), //TODO FIX TYPES

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toastTrigger("Order checkedout successfully", undefined, "success");
        },
        onError: () => {
            toastTrigger("Order checkout failed", undefined, "error");
        },
    });
    return checkoutMutation;
};

export const useInitiatePaymentMutation = ()=>{
    const initiatePaymentMutation = useMutation({
        mutationFn: (data: any) => api.post(`initiate-payment/`, data),
        onError: () => {
            toastTrigger("Order checkout failed", undefined, "error");
        },
    }); //TODO FIX TYPES
    return initiatePaymentMutation;
}

export const useCheckPaymentStatus = ()=>{
    const checkPaymentStatus = useMutation({
        mutationFn: (data: string) => api.post(`verify-payment/`, {pidx:`${data}`}),
        onError: (error) => {
            console.log(error)
            toastTrigger("Order checkout failed", undefined, "error");
        },
    })
    return checkPaymentStatus;
}
