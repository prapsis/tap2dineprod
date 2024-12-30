import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {Form} from "../../../components/ui/form";
import FormInput from "../../../components/reusables/form-input";
import { registerSchema, TRegisterType } from "../../../schemas/register";


export default function RegisterForm() {
    const form = useForm<TRegisterType>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        values: {
            username: "",
            password: "",
            confirmPassword:"",
            email: "",
        }
    });

    const onSubmit = (data: TRegisterType) => {
        console.log(data)
    }

    return (
        <div className="w-full p-4 border rounded-md z-40 bg-background">
            <p className="text-center font-medium text-lg underline underline-offset-4">Register</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-3">
                    <FormInput 
                        label="Email" 
                        form={form} 
                        name="email" 
                        type="email" 
                        placeholder="harekrishna@gmail.com" 
                        required
                        />

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
                        
                        <FormInput 
                        label="Confirm Password" 
                        form={form} 
                        name="confirmPassword" 
                        type="password" 
                        placeholder="Password"
                        required
                        />
                    <Button className="w-full mt-4">Register</Button>
                </form>
            </Form>
        </div>
    )
}
