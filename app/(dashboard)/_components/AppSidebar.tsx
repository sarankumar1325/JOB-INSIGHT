"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import JobSidebarList from "./JobSidebarList";
import SidebarFooterContent from "./SidebarFooterContent";
import Logo from "@/components/Logo";
import { useSupabase } from "@/components/SupabaseProvider";

const AppSidebar = () => {
  const { user, isLoading } = useSupabase();
  const userId = user?.id || "demo-user";

  return (
    <>
      <Sidebar className="!bg-brand-900 px-3 shadow-xl border-r border-brand-800/30">
        <SidebarHeader
          className="flex flex-row w-full items-center
                    justify-between py-4 px-2
                    "
        >
          <Logo className="text-white" />
          <SidebarTrigger className="!text-white !p-2 !bg-brand-800/50 hover:!bg-brand-800 transition-colors rounded-lg" />
        </SidebarHeader>
        <SidebarContent className="overflow-hidden py-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full 
                  !bg-brand-800/20 !text-white
                  border-brand-700/30
                  mt-1 !h-11 !rounded-lg !font-medium 
                  hover:!bg-brand-800/40 transition-all
                  hover:border-brand-700/50 hover-lift
                  "
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>New Job Analysis</span>
                </Button>
              </Link>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* {Job List} */}
          <JobSidebarList userId={userId} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarFooterContent
            isSignedIn={!!user}
            isLoaded={!isLoading}
            userName={user?.name || "Demo User"}
            emailAddress={user?.email || "demo@example.com"}
            userInitial={(user?.name?.[0] || "D").toUpperCase()}
          />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
