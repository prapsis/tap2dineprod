import { api } from "../api";
import {  useMutation, useQueryClient } from '@tanstack/react-query'
import { toastTrigger } from "../../lib/utils";

type TDeleteItem = {
    initiatorName: string;
    type:"category";
}

export const useDeleteItem = ({initiatorName, type}:TDeleteItem) => {
    const queryClient = useQueryClient();
    const { mutate: deleteItem } = useMutation({
        mutationFn: (data: string) => {
            switch (type) {
                case "category":
                    return api.delete(`/categories/${data}`);
                default:
                    return Promise.reject("Unsupported type");
            }
        },
        onSuccess: () => {
            // Invalidate queries based on the type
            switch (type) {
                case "category":
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                    toastTrigger('Category deleted successfully', undefined, 'success');
                    break;
            }
        },
        onError: (error) => {
            console.error(error);
            toastTrigger(`${type.charAt(0).toUpperCase() + type.slice(1)} deletion failed`, undefined, 'error');
        }
    });

    deleteItem(initiatorName);

    return deleteItem;
}
