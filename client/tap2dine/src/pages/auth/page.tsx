import { useState } from "react";
import { Button } from "../../components/ui/button";
import { GIRL_ONLINE_ORDER, HORIZONTAL_LOGO, RESTAURANT } from "../../constants/images"
import LoginForm from "./_components/login-form";
import RegisterForm from "./_components/register-form";

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="w-full h-screen bg-background flex justify-center items-center relative">
            <div className="absolute left-0 bottom-0 z-10">
                <img src={GIRL_ONLINE_ORDER} alt="girl ordering from smartphone" />
            </div>
            <div className="absolute right-0 bottom-0 z-10">
                <img src={RESTAURANT} alt="girl ordering from smartphone" />
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex justify-center items-center">
                    <img src={HORIZONTAL_LOGO} alt="LOGO" width={180} />
                </div>
                {
                    isRegister ? <RegisterForm /> : <LoginForm />
                }
                {
                    !isRegister ? 
                        <p className="text-xs z-40">Don&apos;t have an account? <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="underline underline-offset-4 font-semibold text-xs">Sign Up</Button></p> 
                    : 
                        <p className="text-xs z-40">Go Back to <Button variant={"link"} onClick={() => setIsRegister(!isRegister)} className="underline underline-offset-4 font-semibold text-xs">Login</Button></p>
                }
            </div>
        </div>
    )
}


