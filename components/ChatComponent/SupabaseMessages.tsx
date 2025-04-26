"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSupabase } from "../SupabaseProvider";
import { getConversationMessages, getJobConversation } from "@/lib/supabase-utils";
import { Avatar } from "../ui/avatar";
import { FallbackLoader } from "../FallbackLoader";
import { Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  created_at: string;
  content: string;
  role: string;
}

interface PropType {
  jobId: string;
}

const SupabaseMessages = ({ jobId }: PropType) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { subscribeToChannel, unsubscribeFromChannel } = useSupabase();

  // Fetch conversation and messages
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        
        const conversation = await getJobConversation(jobId);
        if (conversation) {
          setConversationId(conversation.id);
          const messagesData = await getConversationMessages(conversation.id);
          setMessages(messagesData);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [jobId]);

  // Subscribe to real-time updates for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = subscribeToChannel(`messages-${conversationId}`, {
      postgres_changes: {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }
    });

    channel.on('postgres_changes', { event: 'INSERT' }, (payload: any) => {
      const newMessage = payload.new as Message;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      unsubscribeFromChannel(`messages-${conversationId}`);
    };
  }, [conversationId, subscribeToChannel, unsubscribeFromChannel]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto py-6 px-4 flex items-center justify-center">
        <FallbackLoader />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Start a conversation</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Ask questions about this job posting to get insights.
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] md:max-w-[70%] flex-col space-y-2 ${
                  message.role === "user"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div className="flex items-center space-x-2">
                  {message.role !== "user" && (
                    <Avatar className="h-6 w-6 bg-primary text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                    </Avatar>
                  )}
                  <span className="text-xs font-medium text-muted-foreground">
                    {message.role === "user" ? "You" : "JobInsight AI"}
                  </span>
                  {message.role === "user" && (
                    <Avatar className="h-6 w-6 bg-secondary text-secondary-foreground">
                      <User className="h-3 w-3" />
                    </Avatar>
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default SupabaseMessages; 