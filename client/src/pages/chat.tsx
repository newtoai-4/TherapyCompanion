import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ChatInterface } from "@/components/ui/chat-interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ArrowLeft, Brain, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TherabotResponse {
  response: string;
  mood_assessment: string;
  coping_strategies: string[];
  severity_level: 'low' | 'moderate' | 'high' | 'crisis';
  recommend_professional: boolean;
  session_summary: string;
}

export default function Chat() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastResponse, setLastResponse] = useState<TherabotResponse | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const isGuidedMode = location.includes('guided=true');

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const chatMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: userMessage }
      ];
      
      const response = await apiRequest('POST', '/api/chat/therabot', {
        messages: chatMessages
      });
      return response.json();
    },
    onSuccess: (response: TherabotResponse) => {
      setLastResponse(response);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
      
      // Show crisis warning if needed
      if (response.severity_level === 'crisis') {
        toast({
          title: "Crisis Support Needed",
          description: "Please consider contacting emergency services or a crisis hotline immediately.",
          variant: "destructive",
        });
      }
      
      // Recommend professional help
      if (response.recommend_professional) {
        toast({
          title: "Professional Support Recommended",
          description: "Based on our conversation, speaking with a licensed therapist could be very helpful.",
        });
      }
    },
    onError: (error) => {
      setIsTyping(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from Therabot",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize conversation
    if (isAuthenticated && messages.length === 0) {
      const initialMessage = isGuidedMode 
        ? "Hello! I'm Therabot, your AI therapy assistant. I'd like to guide you through some questions to better understand how you're feeling. Shall we start with how your day has been so far?"
        : "Hello! I'm Therabot, your empathetic AI therapy assistant. I'm here to listen and support you in a safe, non-judgmental space. How are you feeling today?";
      
      setMessages([{
        role: 'assistant',
        content: initialMessage,
        timestamp: new Date()
      }]);
    }
  }, [isAuthenticated, isGuidedMode, messages.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-therapy-gray-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-therapy-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-therapy-gray">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    chatMutation.mutate(content);
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'crisis': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'moderate': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default: return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-therapy-gray-light">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-therapy-teal to-therapy-blue rounded-lg flex items-center justify-center">
                <Heart className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MindBridge</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-therapy-gray">
                <Brain className="h-5 w-5" />
                <span className="font-medium">
                  {isGuidedMode ? "Guided Chat with Therabot" : "Chat with Therabot"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-therapy-yellow rounded-full flex items-center justify-center">
                    <Brain className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Therabot</h2>
                    <p className="text-sm text-therapy-gray font-normal">
                      Your empathetic AI therapy assistant
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ChatInterface
                  messages={messages}
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                  isLoading={chatMutation.isPending}
                />
                <div ref={messagesEndRef} />
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Insights */}
            {lastResponse && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Session Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Mood Assessment</div>
                    <div className="text-sm">{lastResponse.mood_assessment}</div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Severity Level</div>
                    <div className={`text-xs px-2 py-1 rounded border ${getSeverityColor(lastResponse.severity_level)}`}>
                      {lastResponse.severity_level.toUpperCase()}
                    </div>
                  </div>
                  
                  {lastResponse.coping_strategies.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-2">Suggested Coping Strategies</div>
                      <ul className="text-xs space-y-1">
                        {lastResponse.coping_strategies.map((strategy, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-therapy-teal rounded-full mt-2"></div>
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Crisis Resources */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Crisis Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div>
                  <div className="font-medium">National Suicide Prevention Lifeline</div>
                  <div className="text-red-700">988 or 1-800-273-8255</div>
                </div>
                <div>
                  <div className="font-medium">Crisis Text Line</div>
                  <div className="text-red-700">Text HOME to 741741</div>
                </div>
                <div>
                  <div className="font-medium">Emergency Services</div>
                  <div className="text-red-700">911</div>
                </div>
              </CardContent>
            </Card>
            
            {/* Disclaimer */}
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">
                  <strong>Important:</strong> Therabot is an AI assistant designed to provide emotional support and guidance. This is not a substitute for professional therapy or medical advice. If you're experiencing a mental health crisis, please contact emergency services immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
