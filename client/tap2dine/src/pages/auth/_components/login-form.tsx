import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {Form} from "../../../components/ui/form";
import { TLoginType, loginSchema } from "../../../schemas/login";
import FormInput from "../../../components/reusables/form-input";


export default function LoginForm() {
    const form = useForm<TLoginType>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        values: {
            username: "",
            password: ""
        }
    });

    const onSubmit = (data: TLoginType) => {
        console.log(data)
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
                    
                    
                    <Button className="w-full mt-4">Login</Button>
                </form>
            </Form>
        </div>
    )
}
