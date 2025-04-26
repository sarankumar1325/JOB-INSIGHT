import { Role } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Loader, MessageSquareText, SparklesIcon, UserIcon } from "lucide-react";
import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useScrollToBottom from "@/hooks/use-scroll-bottom";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface PropType {
  userName: string | null;
  data: any;
}

const ChatMessages = (props: PropType) => {
  const { data, userName } = props;
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerEndRef = useScrollToBottom([data]);

  const messages = useMemo(() => {
    if (!data || !data.success) return [];
    return data.data || [];
  }, [data]);

  if (data === undefined) {
    return (
      <div className="w-full flex justify-center gap-2 p-5">
        <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex max-h-[calc(100vh-10.5rem)] flex-1 flex-col gap-4 p-4 overflow-y-auto scrollbar-hide pt-8 pb-20 bg-white dark:bg-gray-950">
      {messages && messages?.length > 0 ? (
        <>
          {messages?.map((message: any, index: number) => {
            const isUserMessage = message.role === Role.USER;

            return (
              <motion.div
                key={message.id || index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={messageVariants}
                className={cn("flex items-end", {
                  "justify-end": isUserMessage,
                })}
              >
                <div
                  className={cn(
                    "flex flex-col space-y-2 text-base max-w-lg mx-2",
                    {
                      "order-1 items-end": isUserMessage,
                      "order-2 items-start max-w-4xl": !isUserMessage,
                    }
                  )}
                >
                  <div
                    className={cn("flex gap-3", {
                      "items-end": isUserMessage,
                      "items-start": !isUserMessage,
                    })}
                  >
                    {!isUserMessage && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Avatar className="w-8 h-8 border border-primary/20 shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            AI
                          </AvatarFallback>
                          <AvatarImage src="/logo.png" alt="AI Assistant" />
                        </Avatar>
                      </motion.div>
                    )}

                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl shadow-sm transition-colors duration-200",
                        {
                          "bg-primary text-white": isUserMessage,
                          "bg-gray-100 text-gray-800": !isUserMessage && !isDark,
                          "bg-gray-800 text-gray-100": !isUserMessage && isDark,
                        }
                      )}
                    >
                      <div
                        className={cn(
                          "prose max-w-none prose-p:my-1 prose-headings:mb-2 prose-headings:mt-1 prose-li:my-0",
                          {
                            "dark:prose-invert": isDark
                          }
                        )}
                        dangerouslySetInnerHTML={{ __html: message.text }}
                      />
                    </div>

                    {isUserMessage && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Avatar className="w-8 h-8 border border-primary/20 shadow-sm">
                          <AvatarFallback className="bg-primary text-white">
                            {userName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                  </div>
                  <div className={cn("text-xs text-gray-400 px-2", {
                    "text-right": isUserMessage,
                    "text-left": !isUserMessage,
                  })}>
                    {message.createdAt && (
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-4 text-center px-4 py-12"
        >
          <div className="p-4 bg-primary/5 rounded-full">
            <MessageSquareText className="w-10 h-10 text-primary" />
          </div>
          <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
            Your Job Insight Assistant is Ready!
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Get tailored advice and insight to help you ace your job search. Ask me anything about this position!
          </p>
        </motion.div>
      )}

      <div ref={containerEndRef} className="h-4" />
    </div>
  );
};

export default ChatMessages;
