
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Mic, MicOff, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { queryGemini, GeminiResponse } from "@/lib/gemini";
import { useAppContext } from "@/contexts/AppContext";
import RecommendedResources from "./RecommendedResources";

interface QueryInputProps {
  onSaveTopic?: (topic: string) => void;
}

const QueryInput = ({ onSaveTopic }: QueryInputProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { addToHistory, saveTopic } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    console.log("Querying Gemini AI with:", query);

    try {
      const aiResponse = await queryGemini(query);
      setResponse(aiResponse);
      
      // Add to history
      addToHistory({
        query,
        response: aiResponse,
        type: 'query'
      });
      
      toast({
        title: "Query Complete!",
        description: "AI has generated a comprehensive explanation for your topic.",
      });
    } catch (error) {
      console.error("Error querying AI:", error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (response) {
      saveTopic({
        title: query,
        query,
        response
      });
      
      // Legacy callback support
      if (onSaveTopic) {
        onSaveTopic(query);
      }
      
      toast({
        title: "Topic Saved!",
        description: "This topic has been added to your saved list.",
      });
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
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
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

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Input
            placeholder="Ask me anything... (e.g., 'Newton's Laws', 'Photosynthesis', 'Algebra basics')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-base sm:text-lg p-4 sm:p-6 border-2 border-gray-200 focus:border-blue-500 transition-colors pr-12"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={startVoiceRecognition}
            disabled={isListening}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-red-500" />
            ) : (
              <Mic className="w-4 h-4 text-gray-500" />
            )}
          </Button>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg py-4 sm:py-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              AI is thinking...
            </>
          ) : (
            "Ask AI Mentor"
          )}
        </Button>
      </form>

      {response && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <BookOpen className="w-5 h-5" />
                  <span>AI Explanation</span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    {response.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {response.estimatedTime}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={response.explanation}
                readOnly
                className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base leading-relaxed resize-none"
              />
              <Button 
                onClick={handleSave}
                variant="outline" 
                className="mt-4 w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Topic
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Recommended Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Recommended Resources</CardTitle>
              <CardDescription>Curated learning materials for this topic</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendedResources topic={query} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QueryInput;
