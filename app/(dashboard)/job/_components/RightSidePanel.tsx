"use client";

import React, { useState } from "react";
import JobDetails from "./JobDetails";
import ResumePDF from "@/components/ResumePDF";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SwitchHorizontal } from "lucide-react";
import { FileText, FileSpreadsheet } from 'lucide-react';

type Tab = 'details' | 'resume';

const RightSidePanel = (props: { jobId: string }) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Job Details
        </button>
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'resume'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Resume Builder
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <JobDetails jobId={props.jobId} />
          </motion.div>
        ) : (
          <motion.div
            key="resume"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResumePDF jobId={props.jobId} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RightSidePanel;
