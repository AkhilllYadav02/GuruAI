
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Image, Mic, MicOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { solveDoubt } from "@/lib/gemini";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const DoubtSolver = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addMessage = (content: string, type: 'user' | 'ai') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    const question = currentQuestion;
    setCurrentQuestion("");
    addMessage(question, 'user');
    setIsLoading(true);

    try {
      const response = await solveDoubt(question);
      addMessage(response, 'ai');
      
      toast({
        title: "Doubt Solved!",
        description: "AI has provided a detailed explanation.",
      });
    } catch (error) {
      console.error("Error solving doubt:", error);
      toast({
        title: "Error",
        description: "Failed to solve your doubt. Please try again.",
        variant: "destructive",
      });
      addMessage("Sorry, I couldn't process your doubt right now. Please try again.", 'ai');
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

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentQuestion(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
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
        description: "Image OCR feature coming soon!",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="h-[400px] sm:h-[500px]">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">AI Doubt Solver</CardTitle>
          <CardDescription>Ask any question and get instant help</CardDescription>
        </CardHeader>
        <CardContent className="h-full pb-20">
          <ScrollArea className="h-full pr-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-sm sm:text-base mb-2">No messages yet</p>
                  <p className="text-xs sm:text-sm">Ask your first question below!</p>
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
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Ask your doubt here... (e.g., 'How does gravity work?')"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={startVoiceRecognition}
                disabled={isListening}
                className="h-8 w-8 p-0"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
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
              >
                <Image className="w-4 h-4 text-gray-500" />
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !currentQuestion.trim()}
            className="px-4"
          >
            <Send className="w-4 h-4" />
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
