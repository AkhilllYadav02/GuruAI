
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { summarizeNotes } from "@/lib/gemini";

const NotesSummarizer = () => {
  const [content, setContent] = useState("");
  const [summaryType, setSummaryType] = useState<'chapter' | 'topic'>('topic');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please enter some content to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Summarizing notes:", { contentLength: content.length, type: summaryType });

    try {
      const result = await summarizeNotes(content, summaryType);
      setSummary(result);
      
      toast({
        title: "Summary Generated!",
        description: "Your notes have been summarized successfully.",
      });
    } catch (error) {
      console.error("Error summarizing notes:", error);
      toast({
        title: "Error",
        description: "Failed to summarize notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setContent(text);
          toast({
            title: "File Uploaded",
            description: "Text file content loaded successfully.",
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "File Format",
          description: "PDF and image processing coming soon! Please use text files for now.",
        });
      }
    }
  };

  const downloadSummary = () => {
    if (!summary) return;
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${summaryType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Summary has been downloaded to your device.",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Notes Summarizer</span>
          </CardTitle>
          <CardDescription>
            Upload or paste your notes to get AI-powered summaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Summary Type</label>
              <Select value={summaryType} onValueChange={(value: 'chapter' | 'topic') => setSummaryType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topic">Topic-wise</SelectItem>
                  <SelectItem value="chapter">Chapter-wise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Upload File</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Notes
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Content to Summarize
            </label>
            <Textarea
              placeholder="Paste your notes, textbook content, or lecture notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] text-sm sm:text-base"
            />
          </div>

          <Button 
            onClick={handleSummarize}
            disabled={isLoading || !content.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Summary...
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg sm:text-xl">Generated Summary</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{summaryType}</Badge>
                <Button variant="outline" size="sm" onClick={downloadSummary}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={summary}
              readOnly
              className="min-h-[300px] text-sm sm:text-base leading-relaxed resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesSummarizer;
