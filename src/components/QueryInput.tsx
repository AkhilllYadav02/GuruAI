
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Youtube, FileText, Mic, MicOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { queryGemini, GeminiResponse } from "@/lib/gemini";

interface QueryInputProps {
  onSaveTopic: (topic: string) => void;
}

const QueryInput = ({ onSaveTopic }: QueryInputProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    console.log("Querying Gemini AI with:", query);

    try {
      const aiResponse = await queryGemini(query);
      setResponse(aiResponse);
      
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
    onSaveTopic(query);
    toast({
      title: "Topic Saved!",
      description: "This topic has been added to your saved list.",
    });
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
                Save Topic
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Recommended Resources</CardTitle>
              <CardDescription>Curated learning materials for this topic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {response.resources.map((resource, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-blue-100 rounded-lg self-start">
                      {resource.type === "video" ? (
                        <Youtube className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">{resource.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">{resource.description}</p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-blue-600 text-xs sm:text-sm">
                        Open Resource →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QueryInput;
