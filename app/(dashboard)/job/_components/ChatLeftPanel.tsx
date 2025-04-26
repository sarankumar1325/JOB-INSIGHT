"use client";
import SupabaseChat from "@/components/ChatComponent/SupabaseChat";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import React from "react";
import { useSupabase } from "@/components/SupabaseProvider";

const ChatLeftPanel = (props: { jobId: string }) => {
  const { jobId } = props;
  const { open, isMobile } = useSidebar();
  const { user } = useSupabase();

  return (
    <div className="w-full h-screen flex flex-col">
      <div
        className="h-10 w-full border-b
      border-gray-200 pt-1 flex items-center px-2
      "
      >
        <div className="flex items-center gap-2">
          {(!open || isMobile) && <SidebarTrigger />}
          <h1 className="font-semibold pt-1">Job Insight Mode</h1>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <SupabaseChat jobId={jobId} />
      </div>
    </div>
  );
};

export default ChatLeftPanel;
