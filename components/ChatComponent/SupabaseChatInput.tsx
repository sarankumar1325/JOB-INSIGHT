"use client";
import React, { useRef, useState } from "react";
import { AutosizeTextarea, AutosizeTextAreaRef } from "../ui/autosize-textarea";
import { Button } from "../ui/button";
import { Loader, SendIcon, Sparkles } from "lucide-react";
import JobInsightSuggest from "./JobInsightSuggest";
import { toast } from "sonner";
import { useSupabase } from "../SupabaseProvider";
import { addMessageToConversation, getJobConversation } from "@/lib/supabase-utils";

interface PropType {
  jobId: string;
  isDisabled?: boolean;
}

const SupabaseChatInput = ({ jobId, isDisabled = false }: PropType) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useSupabase();
  
  const textAreaRef = useRef<AutosizeTextAreaRef>(null);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isDisabled || !user) return;
    
    setIsLoading(true);
    try {
      // Get the conversation for this job
      const conversation = await getJobConversation(jobId);
      
      if (!conversation) {
        toast.error("Conversation not found");
        return;
      }
      
      // Add the user message to the conversation
      await addMessageToConversation(conversation.id, input, "user");
      
      // Clear the input
      setInput("");
      
      // Process AI response in a separate async function
      // This would typically be triggered by a Supabase function/webhook or client-side
      processAIResponse(conversation.id);
      
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // This function would handle the AI response process
  const processAIResponse = async (conversationId: string) => {
    // In a production app, this would be done server-side with a Supabase Edge Function
    // or a webhook that triggers when a new user message is added
    
    // For now, we'll simulate an AI response after a delay
    try {
      setTimeout(async () => {
        await addMessageToConversation(
          conversationId, 
          "I'm analyzing this job posting and will provide insights shortly...",
          "assistant"
        );
      }, 1000);
    } catch (error: any) {
      console.error("Error processing AI response:", error);
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg animate-slide-up">
      <div className="flex flex-row gap-3 mx-2 md:mx-4 md:last:mb-6 py-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex flex-col h-full flex-1 px-4 mb-0 lg:-mb-3 w-full">
          {/* Suggested prompt */}
          <JobInsightSuggest
            isDisabled={isLoading || isDisabled}
            setInput={setInput}
            onSubmit={handleSubmit}
          />

          <div className="relative flex flex-col w-full border-gray-200 dark:border-gray-700 border shadow-sm rounded-xl p-3 bg-white/50 dark:bg-gray-800/50 hover-scale transition-all">
            <AutosizeTextarea
              ref={textAreaRef}
              rows={3}
              minHeight={20}
              maxHeight={200}
              onChange={handleChange}
              value={input}
              disabled={isDisabled || isLoading || !user}
              onKeyUp={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit(input);
                  textAreaRef.current?.textArea.focus();
                }
              }}
              placeholder={user ? "Ask about the job..." : "Please sign in to chat"}
              className="resize-none pr-12 text-base border-0 bg-transparent shadow-none ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
            />

            <div className="flex w-full items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full font-normal text-xs bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/50"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Job Insights
                </Button>
              </div>

              <Button
                disabled={!input.trim() || isLoading || isDisabled || !user}
                size="icon"
                className="rounded-full bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 disabled:pointer-events-none h-9 w-9 transition-all"
                onClick={() => {
                  handleSubmit(input);
                  textAreaRef.current?.textArea.focus();
                }}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseChatInput; 