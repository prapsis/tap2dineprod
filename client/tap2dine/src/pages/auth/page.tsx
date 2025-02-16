import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { DIGITAL_MENU_LOGO, GIRL_ONLINE_ORDER, RESTAURANT } from "../../constants/images"
import LoginForm from "./_components/login-form";


export default function LoginPage() {
    const navigate = useNavigate();
    return (
        <div className="w-full h-screen bg-background flex flex-col justify-center items-center relative">
            <div className="absolute left-0 bottom-0 z-10">
                <img src={GIRL_ONLINE_ORDER} alt="girl ordering from smartphone" />
            </div>
            <div className="absolute right-0 bottom-0 z-10">
                <img src={RESTAURANT} alt="girl ordering from smartphone" />
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex justify-center items-center">
                    <img src={DIGITAL_MENU_LOGO} alt="LOGO" width={90} />
                </div>
                <LoginForm />
            </div>
            <p className="text-xs z-40">Don&apos;t have an account? <Button variant="link" onClick={() => navigate("/register")} className="underline underline-offset-4 font-semibold text-xs">Sign Up</Button></p>
        </div>
    )
}


