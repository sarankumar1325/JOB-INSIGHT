"use client";

import { Download, Loader, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getJobById } from "@/lib/supabase-utils";
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the ResumePDF component to avoid SSR issues
const ResumePDF = dynamic(() => import('@/components/ResumePDF'), {
  ssr: false,
  loading: () => <div className="min-h-[600px] flex items-center justify-center">
    <div className="flex flex-col gap-2 items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading resume generator...</p>
    </div>
  </div>
});

interface Job {
  id: string;
  title: string;
  description: string;
  company: string | null;
  processed_description: string | null;
  status: string;
}

const JobDetails = ({ jobId }: { jobId?: string }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const paramJobId = searchParams.get('id');
  
  // Use either the prop jobId or the URL parameter
  const effectiveJobId = jobId || paramJobId;

  useEffect(() => {
    const fetchJob = async () => {
      if (effectiveJobId) {
        try {
          // Get job data with the synchronous getJobById function
          const jobData = getJobById(effectiveJobId);
          setJob(jobData);
        } catch (error) {
          console.error('Error fetching job:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchJob();
  }, [effectiveJobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] w-full p-5">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) return (
    <div className="flex justify-center items-center min-h-[300px] w-full p-5 text-muted-foreground">
      Job not found
    </div>
  );
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-6 p-4 max-w-[1600px] mx-auto w-full"
    >
      <div className="w-full md:w-2/3 space-y-6">
        <motion.div 
          className="w-full border border-border bg-card text-card-foreground rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">{job.title}</h2>
              {job.company && <p className="text-muted-foreground mt-1">{job.company}</p>}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: job.processed_description || job.description,
              }}
              className="text-foreground"
            />
          </div>
        </motion.div>
      </div>
      
      <div className="w-full md:w-1/3 lg:sticky lg:top-4 h-fit">
        <ResumePDF jobId={effectiveJobId || ""} className="border border-border bg-card rounded-lg p-4 shadow-sm" />
      </div>
    </motion.div>
  );
};

export default JobDetails;
