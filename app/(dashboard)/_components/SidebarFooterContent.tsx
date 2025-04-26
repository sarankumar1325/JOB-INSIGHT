"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Loader, LogOutIcon } from "lucide-react";
import React from "react";

interface SidebarFooterContentProps {
  isSignedIn: boolean;
  isLoaded: boolean;
  userName: string;
  userInitial: string;
  emailAddress: string;
}

const SidebarFooterContent = ({
  isSignedIn,
  isLoaded,
  userName,
  emailAddress,
  userInitial,
}: SidebarFooterContentProps) => {
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center pb-5">
        <Loader size="2rem" className="animate-spin text-white" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {isSignedIn && (
        <Popover>
          <PopoverTrigger asChild>
            <div
              role="button"
              className="
            flex items-center gap-3 p-2 rounded-lg 
      hover:bg-[rgba(255,255,255,0.05)] 
      transition-colors
            "
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className="
                bg-gray-800 border text-primary-foreground
                "
                >
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white font-medium">{userName}</p>
                <p className="text-muted-foreground text-xs">{emailAddress}</p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="
                  w-64 px-4 pt-5 pb-2 bg-[rgb(40,40,40)]
             !text-white border-gray-600
                  "
          >
            <div className="space-y-2">
              <h4
                className="font-semibold leading-none
                          text-sm !pl-1 mb-1"
              >
                Account
              </h4>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      <div className="flex items-center justify-between px-3 pt-2 pb-4">
        <span className="text-xs text-gray-400">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default SidebarFooterContent;
