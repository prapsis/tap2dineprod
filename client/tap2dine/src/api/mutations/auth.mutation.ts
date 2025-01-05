import { api } from "../api";
import { useMutation } from '@tanstack/react-query'
import { toastTrigger } from "../../lib/utils";
import { TLoginType } from "../../schemas/login";
import { useNavigate } from "react-router";
import { TRegisterType } from "../../schemas/register";

export const useLoginMutation = () => {
const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn: (data:TLoginType) => api.post('/auth/token', data),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            toastTrigger('Login successful', undefined,'success');
            navigate('/');
        },
        onError: () => {
            toastTrigger('Login failed: Invalid Email or password.',undefined, 'error');
        }
    }
    )
    return loginMutation
}

export const useRegisterMutation = () => {
    const navigate = useNavigate()
    const registerMutation = useMutation({
        mutationFn: (data:TRegisterType) => api.post('/register/', data),
        onSuccess: () => {
            toastTrigger('Registration successful', undefined,'success');
            navigate('/auth');
        },
        onError: () => {
            toastTrigger('Registration failed', undefined,'error');
        }
    }
    )
    return registerMutation
}

