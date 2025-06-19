
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Image, Mic, MicOff, Clock, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { solveDoubt } from "@/lib/gemini";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const DoubtSolver = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const addMessage = (content: string, type: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Auto scroll to bottom
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    const question = currentQuestion.trim();
    setCurrentQuestion("");
    addMessage(question, 'user');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing-' + Date.now(),
      type: 'ai',
      content: 'AI is thinking...',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await solveDoubt(question);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Clean and format the response
      const cleanResponse = response
        .replace(/\*\*/g, '') // Remove markdown bold
        .replace(/\*/g, '') // Remove markdown italic
        .replace(/```/g, '') // Remove code blocks
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\[|\]/g, '') // Remove brackets
        .replace(/"{2,}/g, '"') // Replace multiple quotes
        .replace(/\s+/g, ' ') // Replace multiple spaces
        .trim();
      
      addMessage(cleanResponse, 'ai');
      
      toast({
        title: "Doubt Solved!",
        description: "AI has provided a detailed explanation.",
      });
    } catch (error) {
      console.error("Error solving doubt:", error);
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      toast({
        title: "Error",
        description: "Failed to solve your doubt. Please try again.",
        variant: "destructive",
      });
      addMessage("Sorry, I couldn't process your doubt right now. Please try again or rephrase your question.", 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your question clearly.",
        });
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentQuestion(transcript);
        setIsListening(false);
        
        toast({
          title: "Voice Captured",
          description: "Question recorded successfully.",
        });
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        console.error("Speech recognition error:", event.error);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or type your question.",
          variant: "destructive",
        });
      };
      
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Image Upload",
        description: "Image OCR feature coming soon! For now, please type your question.",
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "All messages have been cleared.",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="h-[450px] sm:h-[550px]">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                AI Doubt Solver
                <Badge variant="secondary" className="text-xs">
                  {messages.filter(m => m.type === 'user').length} questions
                </Badge>
              </CardTitle>
              <CardDescription>Ask any question and get instant, detailed explanations</CardDescription>
            </div>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear Chat
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="h-full pb-4">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm sm:text-base mb-2 font-medium">No questions yet</p>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-xs">
                    Ask your first question below! I can help with math, science, 
                    history, and any academic topic.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 sm:p-4 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : message.isTyping 
                          ? 'bg-gray-100 text-gray-600 rounded-bl-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      } shadow-sm`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs opacity-70 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(message.timestamp)}
                            </p>
                            {message.type === 'ai' && !message.isTyping && (
                              <Badge variant="outline" className="text-xs">
                                AI Response
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Ask your doubt here... (e.g., 'How does photosynthesis work?', 'Solve: 2x + 5 = 13')"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="pr-24 text-sm sm:text-base py-3"
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startVoiceRecognition}
                disabled={isListening || isLoading}
                className="h-8 w-8 p-0"
                title="Voice input"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500 animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4 text-gray-500" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 p-0"
                title="Upload image (coming soon)"
              >
                <Image className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !currentQuestion.trim()}
            className="px-6 py-3"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentQuestion("How does photosynthesis work?")}
            className="text-xs"
          >
            Science Example
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentQuestion("Solve: 2x + 5 = 13")}
            className="text-xs"
          >
            Math Example
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentQuestion("Explain World War 2 causes")}
            className="text-xs"
          >
            History Example
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </form>
    </div>
  );
};

export default DoubtSolver;
