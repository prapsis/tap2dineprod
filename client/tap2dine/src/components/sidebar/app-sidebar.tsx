import {
  Coffee,
  HandPlatter,
  Home,
  ShoppingBag,
  ShoppingBasket,
  Utensils,
  LeafyGreen,
  Banknote,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar.tsx";

import { HORIZONTAL_LOGO, LOGO } from "../../constants/images.ts";
import { cn } from "../../lib/utils.ts";
import { Link } from "react-router";
import useAuthContext from "../../hooks/useAuthContext.tsx";
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "Menus",
    url: "/menu",
    icon: HandPlatter,
  },
  {
    title: "Table",
    url: "/table",
    icon: Utensils,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: ShoppingBasket,
  },
  {
    title: "Category",
    url: "/category",
    icon: Coffee,
  },
  {
    title: "Add-ons",
    url: "/add-ons",
    icon: LeafyGreen,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: Banknote,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const auth = useAuthContext();

  const handleLogout = () => {
    if (auth) {
      auth.logout();
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          state === "collapsed" ? "" : "flex items-center justify-center",
        )}
      >
        <img
          src={state === "collapsed" ? LOGO : HORIZONTAL_LOGO}
          alt="logo"
          className={cn(state === "collapsed" ? "w-16" : "w-8/12")}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto mb-4 mx-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
