"use client";
import React, { useRef, useState } from "react";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Bot, Loader, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createJob } from "@/lib/supabase-utils";
import { useSupabase } from "@/components/SupabaseProvider";

const JobInfoForm = () => {
  const router = useRouter();
  const { user } = useSupabase();
  const userId = user?.id || "demo-user"; // Use user ID from Supabase or fallback to demo

  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<AutosizeTextAreaRef>(null);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createJob(userId, jobDescription);
      router.push(`job/${response.data}`);
    } catch (error: any) {
      toast.error(`Failed to create job: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-3 mb-3 z-10 mx-auto w-full max-w-3xl animate-enter">
      <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover-scale">
        <div className="py-4 px-4 bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/40 dark:to-brand-900/60 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold">Job Analysis Assistant</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Paste your job description below to get AI-powered insights</p>
        </div>
      
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <AutosizeTextarea
                ref={textareaRef}
                rows={6}
                maxHeight={400}
                minHeight={160}
                value={jobDescription}
                onChange={handleChange}
                placeholder="Paste job title & description here..."
                className="w-full p-4 text-base border border-gray-200 dark:border-gray-700 rounded-xl 
                          focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all
                          resize-none bg-white/50 dark:bg-gray-900/50"
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic pl-1">
                {jobDescription.length > 0 ? 
                  `${jobDescription.length} characters` : 
                  "Our AI will analyze your job description"
                }
              </p>
              
              <Button
                type="submit"
                disabled={isSubmitting || !jobDescription?.trim()}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg 
                           transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Get Insights</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 px-3">
        <FeatureCard 
          icon={<Bot className="h-5 w-5" />}
          title="Job Analysis"
          description="Get detailed insights about required skills and responsibilities"
        />
        <FeatureCard 
          icon={<Sparkles className="h-5 w-5" />}
          title="Interview Prep"
          description="Prepare for interviews with tailored questions and answers"
        />
        <FeatureCard 
          icon={<ArrowRight className="h-5 w-5" />}
          title="Skill Gap Analysis"
          description="Identify skill gaps and learn how to address them"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="rounded-xl p-4 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover-lift">
    <div className="h-8 w-8 rounded-lg bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-3">
      {icon}
    </div>
    <h3 className="font-medium text-foreground mb-1">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default JobInfoForm;
