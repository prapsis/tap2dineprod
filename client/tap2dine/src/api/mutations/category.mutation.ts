import { api } from "../api";
import {  useMutation, useQueryClient } from '@tanstack/react-query'
import { toastTrigger } from "../../lib/utils";
import { TCategoryType } from "../../schemas/category";

export const useAddCategoryMutation = () => {
    const queryClient = useQueryClient();
    const addCategoryMutation = useMutation({
        mutationFn: (data:TCategoryType) => api.post('/categories/', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories']});
            toastTrigger('Category added successfully',undefined,'success');
        },
        onError: (data) => {
            console.log(data);
            toastTrigger('Category add failed',undefined,'error');
        }
    }
    )
    return addCategoryMutation
}

export const useEditCategoryMutation = ({initiatorName}:{initiatorName:string}) => {

    const editCategoryMutation = useMutation({
        mutationFn: (data:TCategoryType) => api.patch(`/categories/${initiatorName}`, data),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            toastTrigger('Category edited successfully',undefined,'success');
        },
        onError: (data) => {
            console.log(data);
            toastTrigger('Category edit failed',undefined,'error');
        }
    }
    )
    return editCategoryMutation
}