"use client";

import React, { useEffect, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { useSupabase } from "@/components/SupabaseProvider";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

// Message type definition
type Message = {
  id: string;
  text: string;
  role: 'USER' | 'AI';
  createdAt: number;
};

interface PropsType {
  jobId: string;
}

const SupabaseChat = ({ jobId }: PropsType) => {
  const { user } = useSupabase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Get chat messages from localStorage
    const loadMessages = () => {
      try {
        if (typeof window !== 'undefined') {
          setLoading(true);
          
          // Try to load messages from localStorage
          const storedMessages = localStorage.getItem(`chat_${jobId}`);
          if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
          } else {
            // If no messages found, create a welcome message
            const welcomeMessage = {
              id: `msg_${Math.random().toString(36).substring(2, 9)}`,
              text: createWelcomeMessage(jobId),
              role: 'AI' as const,
              createdAt: Date.now()
            };
            
            // Save to localStorage
            localStorage.setItem(`chat_${jobId}`, JSON.stringify([welcomeMessage]));
            setMessages([welcomeMessage]);
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    
    // Listen for storage events to update in real-time across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `chat_${jobId}`) {
        loadMessages();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [jobId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-full flex flex-col justify-between gap-2 bg-white dark:bg-gray-950 
                border-gray-100 dark:border-gray-800"
    >
      <div className="flex flex-1 justify-between">
        <ChatMessages 
          userName={user?.name || "You"} 
          data={{ 
            data: messages, 
            success: true 
          }} 
        />
      </div>

      <ChatInput
        jobId={jobId}
        userId={user?.id || "demo-user"}
        isDisabled={loading}
      />
    </motion.div>
  );
};

// Helper function to create welcome message
function createWelcomeMessage(jobId: string) {
  return `
  <h3>Welcome to your Job Insight Assistant!</h3>
  <p>I've analyzed this position for you.</p>
  <p>Here's what I can help with:</p>
  <ul>
    <li>
      <h5>📝 CV Optimization:</h5>
      <p>Tailor your CV to match the job description and highlight relevant skills.</p>
    </li>
    <li>
      <h5>🔍 Skill Analysis:</h5>
      <p>Identify key skills and gaps to focus on.</p>
    </li>
    <li>
      <h5>📊 Specific Insights:</h5>
      <p>Understand the role's requirements, responsibilities, and expectations.</p>
    </li>
  </ul>
  <p>What would you like to focus on first?</p>
  `;
}

export default SupabaseChat; 