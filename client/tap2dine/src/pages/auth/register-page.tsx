import { Button } from "../../components/ui/button";
import { DIGITAL_MENU_LOGO, GIRL_ONLINE_ORDER, RESTAURANT } from "../../constants/images"
import RegisterForm from "./_components/register-form";

export default function RegisterPage() {

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
                <RegisterForm /> 
            </div>
            <p className="text-xs z-40">Go Back to <Button variant={"link"} className="underline underline-offset-4 font-semibold text-xs" onClick={() => window.location.href = "/login"}>Login</Button></p>
        </div>
    )
}


