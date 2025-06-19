
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Brain, RotateCcw, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateFlashcards, FlashCard } from "@/lib/gemini";

const FlashcardSystem = () => {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studyMode, setStudyMode] = useState<'study' | 'review'>('study');
  const [progress, setProgress] = useState<{ [key: string]: 'easy' | 'medium' | 'hard' | 'unseen' }>({});

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic to generate flashcards.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Generating flashcards for:", topic);

    try {
      const cards = await generateFlashcards(topic, 10);
      setFlashcards(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      
      // Initialize progress tracking
      const initialProgress: { [key: string]: 'unseen' } = {};
      cards.forEach(card => {
        initialProgress[card.id] = 'unseen';
      });
      setProgress(initialProgress);

      toast({
        title: "Flashcards Generated!",
        description: `Created ${cards.length} flashcards for ${topic}.`,
      });
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const markDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      setProgress(prev => ({
        ...prev,
        [currentCard.id]: difficulty
      }));
      
      // Auto advance to next card
      setTimeout(() => {
        nextCard();
      }, 500);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    const resetProgress: { [key: string]: 'unseen' } = {};
    flashcards.forEach(card => {
      resetProgress[card.id] = 'unseen';
    });
    setProgress(resetProgress);
  };

  const getProgressStats = () => {
    const total = flashcards.length;
    const completed = Object.values(progress).filter(p => p !== 'unseen').length;
    const easy = Object.values(progress).filter(p => p === 'easy').length;
    const medium = Object.values(progress).filter(p => p === 'medium').length;
    const hard = Object.values(progress).filter(p => p === 'hard').length;
    
    return { total, completed, easy, medium, hard };
  };

  if (flashcards.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Flashcard Generator</span>
            </CardTitle>
            <CardDescription>
              Generate AI-powered flashcards for any topic with spaced repetition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <Input
                placeholder="e.g., 'Photosynthesis', 'World War 2', 'Algebra'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={handleGenerateFlashcards}
              disabled={isLoading || !topic.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base sm:text-lg py-4 sm:py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                "Generate Flashcards"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const stats = getProgressStats();
  const progressPercentage = (stats.completed / stats.total) * 100;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">{topic} Flashcards</CardTitle>
              <CardDescription>
                Card {currentIndex + 1} of {flashcards.length}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetSession}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFlashcards([])}>
                New Topic
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">Easy: {stats.easy}</Badge>
              <Badge variant="secondary">Medium: {stats.medium}</Badge>
              <Badge variant="secondary">Hard: {stats.hard}</Badge>
              <Badge variant="outline">Remaining: {stats.total - stats.completed}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Flashcard */}
      <Card className="min-h-[300px] sm:min-h-[400px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <CardContent className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
          <div className="text-center space-y-4 w-full">
            <div className="flex items-center justify-center mb-4">
              <Badge variant={currentCard.difficulty === 'easy' ? 'secondary' : currentCard.difficulty === 'medium' ? 'default' : 'destructive'}>
                {currentCard.difficulty}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
              >
                {isFlipped ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="min-h-[150px] sm:min-h-[200px] flex items-center justify-center">
              <p className="text-lg sm:text-xl lg:text-2xl text-center break-words leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>
            
            <p className="text-sm text-gray-500">
              {isFlipped ? "Answer" : "Question"} - Click to flip
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation and Difficulty Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="flex-1 mr-2"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={nextCard}
            disabled={currentIndex === flashcards.length - 1}
            className="flex-1 ml-2"
          >
            Next
          </Button>
        </div>

        {isFlipped && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => markDifficulty('easy')}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Easy
            </Button>
            <Button
              variant="outline"
              onClick={() => markDifficulty('medium')}
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Medium
            </Button>
            <Button
              variant="outline"
              onClick={() => markDifficulty('hard')}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Hard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardSystem;
