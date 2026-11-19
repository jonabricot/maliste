import { Outlet } from "react-router";
import { AppSidebar } from "../app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { LucideArrowLeft } from "lucide-react";
import { cn } from "cn";

export function DashboardLayout() {
    return <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="border-b p-1">
            <SidebarTrigger size="icon">{state => <LucideArrowLeft className={cn('transition-all', state === "collapsed" && "rotate-180")}/>}</SidebarTrigger>
        </div>
        
        <div className="p-4">
            <Outlet/>
        </div>
      </main>
    </SidebarProvider>
}