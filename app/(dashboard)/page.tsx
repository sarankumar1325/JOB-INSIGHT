"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import JobInfoForm from "./_components/JobInfoForm";
import AppHighlights from "./_components/AppHighlights";
import { Bot, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { open, isMobile } = useSidebar();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full relative flex-1 min-h-screen flex
        flex-col items-center bg-gradient-to-br
        from-purple-500/5 to-primary/5
        px-4 sm:px-6 lg:px-8 font-poppins
      "
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="absolute left-5 top-5"
      >
        {(!open || isMobile) && <SidebarTrigger />}
      </motion.div>

      <div className="space-y-6 w-full max-w-7xl mx-auto">
        <AppHighlights />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-5"
        >
          <h1
            className="text-[2.5rem] md:text-5xl lg:text-6xl
              font-bold bg-gradient-to-r from-primary
              to-purple-600 bg-clip-text text-transparent
              tracking-[-0.8px] font-poppins
            "
          >
            AI Job Insight
            <motion.span 
              className="relative inline-block pl-3 sm:pl-5"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <div
                className="absolute -right-2
                  top-0 w-[180px]
                  md:w-[220px] lg:w-[270px] h-10 sm:h-14
                  lg:h-16 bg-primary rounded-lg z-10
                "
              />
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-white">Assistant</span>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageSquare className="w-6 h-6 text-white inline-block" />
                </motion.div>
              </div>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300
              mt-3 sm:mt-4 max-w-2xl mx-auto font-poppins
            "
          >
            Join millions of{" "}
            <span className="relative inline-block">
              <span className="text-[#FB923C]">
                job seekers and professionals
              </span>
              <svg
                viewBox="0 0 336 10"
                className="absolute left-[1%] bottom-0 w-[97%]
                  h-[7px]"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <motion.path
                  d="M1 8.90571C100.5 7.40571 306.7 5.305715 334 8.90571"
                  stroke="#FB923C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
              </svg>
            </span>{" "}
            to instantly
            <br className="hidden sm:block" />
            get job insights and prepare for interviews with AI-powered tools
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <JobInfoForm />
        </motion.div>
      </div>
      
      <motion.div
        className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2, type: 'spring' }}
      >
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop" 
            }}
          >
            <Bot className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
}
