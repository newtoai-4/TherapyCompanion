import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ChatInterface({ 
  messages, 
  isTyping = false, 
  onSendMessage, 
  isLoading = false,
  className 
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const message = inputMessage.trim();
    if (message && !isLoading) {
      onSendMessage(message);
      setInputMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 mb-4">
      <div className="w-8 h-8 bg-therapy-yellow rounded-full flex items-center justify-center flex-shrink-0">
        <Brain className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg px-4 py-3 max-w-xs">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-therapy-gray rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-therapy-gray rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-therapy-gray rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        <div className="text-xs text-therapy-gray mt-1">
          Therabot is typing...
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start space-x-3",
                message.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === 'user' 
                  ? "bg-therapy-blue" 
                  : "bg-therapy-yellow"
              )}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Brain className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className={cn(
                "flex-1 max-w-xs sm:max-w-md",
                message.role === 'user' ? "text-right" : ""
              )}>
                <div className={cn(
                  "rounded-lg px-4 py-3 text-sm leading-relaxed",
                  message.role === 'user'
                    ? "bg-therapy-blue text-white ml-auto"
                    : "bg-gray-100 text-gray-900"
                )}>
                  {message.content.split('\n').map((line, lineIndex) => (
                    <div key={lineIndex}>
                      {line}
                      {lineIndex < message.content.split('\n').length - 1 && <br />}
                    </div>
                  ))}
                </div>
                <div className={cn(
                  "text-xs text-therapy-gray mt-1",
                  message.role === 'user' ? "text-right" : ""
                )}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          
          {messages.length === 0 && !isTyping && (
            <div className="text-center py-8 text-therapy-gray">
              <Brain className="h-16 w-16 mx-auto mb-4 text-therapy-yellow opacity-50" />
              <h3 className="text-lg font-medium mb-2">Welcome to Therabot</h3>
              <p className="text-sm">
                I'm here to provide empathetic support and guidance. 
                Feel free to share what's on your mind.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[44px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-therapy-teal hover:bg-therapy-teal-light text-white px-4 py-2 h-auto self-end"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-therapy-gray">
          <strong>Remember:</strong> This is a supportive conversation, but Therabot is not a replacement for professional therapy. 
          If you're in crisis, please contact emergency services immediately.
        </div>
      </div>
    </div>
  );
}
