import { Outlet } from "react-router";
import { AppSidebar } from "../../components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { Toaster } from "sonner";


export default function Layout() {
    return (
        <>
            <div>
                <SidebarProvider>
                    <Toaster />
                    <AppSidebar />
                    <div className="relative min-w-[calc(100%-16rem)]">
                        <SidebarTrigger className="absolute left-2"/>
                        <div className="p-4">
                            <Outlet />
                        </div>
                    </div>
                </SidebarProvider>
            </div>
        </>
    )
}
