
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Youtube, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QueryInputProps {
  onSaveTopic: (topic: string) => void;
}

const QueryInput = ({ onSaveTopic }: QueryInputProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    console.log("Querying AI with:", query);

    try {
      // Simulate AI response - in real implementation, this would call Gemini API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        explanation: `Here's a comprehensive explanation of "${query}":\n\nThis topic involves several key concepts that are fundamental to understanding the subject. The main principles include...\n\n1. Primary concept: Basic foundation and core principles\n2. Secondary aspects: Related theories and applications\n3. Practical examples: Real-world applications and use cases\n\nThis knowledge builds upon previous concepts and connects to broader themes in the field.`,
        resources: [
          {
            type: "video",
            title: `Understanding ${query} - Complete Guide`,
            url: "https://youtube.com/watch?v=example",
            description: "Comprehensive video explanation with visual examples"
          },
          {
            type: "article",
            title: `${query}: Detailed Analysis`,
            url: "https://example.com/article",
            description: "In-depth written explanation with diagrams"
          }
        ],
        difficulty: "intermediate",
        estimatedTime: "15-20 minutes"
      };

      setResponse(mockResponse);
      
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Ask me anything... (e.g., 'Newton's Laws', 'Photosynthesis', 'Algebra basics')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-lg p-6 border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg py-6"
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
        <div className="space-y-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>AI Explanation</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge variant="secondary">{response.difficulty}</Badge>
                  <Badge variant="outline">{response.estimatedTime}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={response.explanation}
                readOnly
                className="min-h-[200px] text-base leading-relaxed resize-none"
              />
              <Button 
                onClick={handleSave}
                variant="outline" 
                className="mt-4"
              >
                Save Topic
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Resources</CardTitle>
              <CardDescription>Curated learning materials for this topic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {response.resources.map((resource: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {resource.type === "video" ? (
                        <Youtube className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
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
