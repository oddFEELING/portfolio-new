import AppSidebar from "@/components/navigation/app.sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import type { Route } from "./+types/landing";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Emmanuel Alawode" },
    { name: "description", content: "I build stuff. And they work." },
  ];
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden border">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
