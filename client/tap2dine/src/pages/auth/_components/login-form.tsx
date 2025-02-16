import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {Form} from "../../../components/ui/form";
import { TLoginType, loginSchema } from "../../../schemas/login";
import FormInput from "../../../components/reusables/form-input";
import { useLoginMutation } from "../../../api/mutations/auth.mutation";
import useAuthContext from "../../../hooks/useAuthContext";
import { toastTrigger } from "../../../lib/utils";
import { useNavigate } from "react-router";


export default function LoginForm() {
    const navigate = useNavigate();
    const { setAccessToken, validateToken} = useAuthContext();
    const form = useForm<TLoginType>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        values: {
            username: "",
            password: ""
        }
    });

    const {mutate,isLoading} = useLoginMutation();
    const onSubmit = (data: TLoginType) => {
        mutate(data,{
            onSuccess: (data) => {
                localStorage.setItem("accessToken", data?.data.access);
                localStorage.setItem("refreshToken", data?.data.refresh);
                setAccessToken(data?.data.access); // Update the token state
                toastTrigger("Login successful", undefined, "success");
                validateToken(); // Trigger re-validation
                // window.location.href = "/";
                navigate("/");
            }
        })
    }

    return (
        <div className="w-full p-4 border rounded-md z-40 bg-background">
            <p className="text-center font-medium text-lg underline underline-offset-4">Log In</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-3">
                    <FormInput 
                        label="Username" 
                        form={form} 
                        name="username" 
                        type="text" 
                        placeholder="Username"
                        required
                        />
                    
                    <FormInput 
                        label="Password" 
                        form={form} 
                        name="password" 
                        type="password" 
                        placeholder="Password"
                        required
                        />
                    
                    
                    <Button className="w-full mt-4" disabled={isLoading}>Login</Button>
                </form>
            </Form>
        </div>
    )
}
