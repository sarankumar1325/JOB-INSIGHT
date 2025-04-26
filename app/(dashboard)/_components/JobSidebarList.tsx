"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MessageSquareTextIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

// Define the Job type
type Job = {
  id: string;
  jobTitle: string;
  userId: string;
  createdAt: number;
};

const JobSidebarList = (props: { userId: string }) => {
  const pathname = usePathname();
  const [jobs, setJobs] = useState<Job[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to get jobs from localStorage
    const getJobs = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedJobs = localStorage.getItem('jobs');
          if (storedJobs) {
            const parsedJobs = JSON.parse(storedJobs);
            // Filter jobs by userId
            const userJobs = parsedJobs.filter((job: Job) => job.userId === props.userId);
            setJobs(userJobs);
          } else {
            setJobs([]);
          }
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    getJobs();

    // Listen for storage events to update the jobs list in real-time
    const handleStorageChange = () => getJobs();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [props.userId]);

  if (isLoading || jobs === undefined) {
    return (
      <div className="w-full flex flex-col gap-3 px-2">
        <Skeleton className="h-[20px] w-full bg-gray-600" />
        <Skeleton className="h-[20px] w-full bg-gray-600" />
        <Skeleton className="h-[20px] w-full bg-gray-600" />
      </div>
    );
  }

  if (jobs?.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/80 mt-0">
        Job List
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu
          className="min-h-[180px] max-h-[350px]
             scrollbar overflow-y-auto pb-2
              "
        >
          {jobs?.map((item) => {
            const jobPageUrl = `/job/${item.id}`;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  className={cn(
                    `
            !bg-transparent !text-white hover:!bg-gray-700
            transition-colors
            `,
                    jobPageUrl === pathname && "!bg-gray-700"
                  )}
                  asChild
                >
                  <Link href={jobPageUrl} className="text-white">
                    <MessageSquareTextIcon className="w-4 h-4" />
                    <span>{item.jobTitle}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default JobSidebarList;
