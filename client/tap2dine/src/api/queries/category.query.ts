import { api } from "../api";
import { useQuery } from '@tanstack/react-query';
import { toastTrigger } from "../../lib/utils";

export const useFetchCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories/');
            return response.data;
        },
        onError: () => {
            toastTrigger('Failed to fetch categories',undefined,'error')
        }
    });
}