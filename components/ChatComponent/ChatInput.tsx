"use client";
import React, { useRef, useState, useEffect } from "react";
import { AutosizeTextarea, AutosizeTextAreaRef } from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import { Lightbulb, Loader, SendIcon, Sparkles } from "lucide-react";
import JobInsightSuggest from "./JobInsightSuggest";
import { toast } from "sonner";
import { genAI } from "@/lib/gemini-ai";
import { getJobInsightConversationPrompt } from "@/lib/prompt";
import { motion } from "framer-motion";

interface PropType {
  jobId: string;
  userId: string | null;
  isDisabled: boolean;
}

// Three dots loading animation component
const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-1.5 h-1.5 bg-primary rounded-full"
          initial={{ opacity: 0.3, y: 0 }}
          animate={{ opacity: 1, y: [0, -3, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: dot * 0.2,
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  );
};

const ChatInput = ({ jobId, isDisabled, userId }: PropType) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const textAreaRef = useRef<AutosizeTextAreaRef>(null);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isDisabled || !userId) return;
    setIsLoading(true);
    
    try {
      // First, add the user message to localStorage
      addMessageToLocalStorage(jobId, input, 'USER');
      
      // Clear input field immediately to improve UX
      setInput("");
      
      // Add a temporary AI message
      const aiMessageId = addMessageToLocalStorage(jobId, "...", 'AI');
      
      // Get existing messages for context
      const messages = getMessagesFromLocalStorage(jobId);
      const chatHistory = messages.filter(msg => msg.id !== aiMessageId).map(msg => ({
        content: msg.text,
        role: msg.role === 'USER' ? "user" : "model",
        timestamp: new Date(msg.createdAt).toISOString()
      }));
      
      // Get job details - in a real app, this would come from Supabase
      const jobInfo = getJobFromLocalStorage(jobId);
      
      // Create the prompt for Gemini
      const prompt = getJobInsightConversationPrompt(
        jobInfo?.jobTitle || "Job Position", 
        jobInfo?.processedDescription || "Job Description", 
        input,
        chatHistory
      );
      
      // Generate AI response using Gemini
      const stream = await genAI.chats.create({ model: "gemini-2.0-flash" });
      const result = await stream.sendMessage({ message: prompt });
      
      if (result.text) {
        // Update the AI message with the real response
        updateMessageInLocalStorage(jobId, aiMessageId, result.text);
      } else {
        throw new Error("Failed to generate response");
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for localStorage
  function getMessagesFromLocalStorage(jobId: string) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`chat_${jobId}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }
  
  function getJobFromLocalStorage(jobId: string) {
    if (typeof window !== 'undefined') {
      const storedJobs = localStorage.getItem('jobs');
      if (storedJobs) {
        const jobs = JSON.parse(storedJobs);
        return jobs.find((job: any) => job.id === jobId);
      }
    }
    return null;
  }

  function addMessageToLocalStorage(jobId: string, text: string, role: 'USER' | 'AI') {
    if (typeof window !== 'undefined') {
      const messageId = `msg_${Math.random().toString(36).substring(2, 9)}`;
      const message = {
        id: messageId,
        text,
        role,
        createdAt: Date.now()
      };
      
      const messages = getMessagesFromLocalStorage(jobId);
      const updatedMessages = [...messages, message];
      
      localStorage.setItem(`chat_${jobId}`, JSON.stringify(updatedMessages));
      
      // Trigger storage event to update other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: `chat_${jobId}`,
        newValue: JSON.stringify(updatedMessages),
      }));
      
      return messageId;
    }
    return '';
  }
  
  function updateMessageInLocalStorage(jobId: string, messageId: string, text: string) {
    if (typeof window !== 'undefined') {
      const messages = getMessagesFromLocalStorage(jobId);
      const updatedMessages = messages.map(msg => 
        msg.id === messageId ? { ...msg, text } : msg
      );
      
      localStorage.setItem(`chat_${jobId}`, JSON.stringify(updatedMessages));
      
      // Trigger storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: `chat_${jobId}`,
        newValue: JSON.stringify(updatedMessages),
      }));
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky bottom-0 w-full bg-background/80 backdrop-blur-md shadow-md border-t border-border z-10"
    >
      <div className="flex flex-row gap-3 mx-2 md:mx-4 md:last:mb-6 py-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex flex-col h-full flex-1 px-4 mb-0 lg:-mb-3 w-full">
          {/* Suggested prompt */}
          <JobInsightSuggest
            isDisabled={isLoading || isDisabled}
            setInput={setInput}
            onSubmit={handleSubmit}
          />

          <motion.div
            whileTap={{ scale: 0.995 }}
            className={`relative flex flex-col w-full border border-input
              ${isFocused ? 'ring-2 ring-primary/30' : 'shadow-sm'} 
              rounded-xl p-3 bg-card text-card-foreground transition-all duration-200`}
          >
            <AutosizeTextarea
              ref={textAreaRef}
              rows={1}
              minHeight={20}
              maxHeight={200}
              onChange={handleChange}
              value={input}
              disabled={isDisabled || isLoading}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyUp={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(input);
                  textAreaRef.current?.textArea.focus();
                }
              }}
              placeholder="Ask about the job..."
              className="resize-none pr-12 text-base text-foreground
                border-0 bg-transparent
                shadow-none ring-0
                focus-visible:ring-offset-0
                focus-visible:ring-0
                placeholder:text-muted-foreground/70
                transition-all duration-200"
            />

            <div className="flex w-full items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-medium text-xs
                  bg-primary/5 hover:bg-primary/10
                  text-primary border-primary/20
                  transition-all duration-200"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Job Insights</span>
                  <span className="sm:hidden">AI</span>
                </Button>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  disabled={!input.trim() || isLoading || isDisabled}
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90
                    text-primary-foreground disabled:opacity-50 disabled:bg-muted
                    shadow-sm hover:shadow-md
                    transition-all duration-200 h-9 w-9"
                  onClick={() => {
                    handleSubmit(input);
                    textAreaRef.current?.textArea.focus();
                  }}
                >
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    <SendIcon className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInput;
