import { noAuthApi } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastTrigger } from "../../lib/utils";
import { TOrderType } from "../../schemas/order";


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