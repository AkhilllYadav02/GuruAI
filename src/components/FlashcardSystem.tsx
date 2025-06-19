
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Brain, RotateCcw, CheckCircle, XCircle, Eye, EyeOff, Shuffle, Timer, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { generateFlashcards, FlashCard } from "@/lib/gemini";

const FlashcardSystem = () => {
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [studyMode, setStudyMode] = useState<'study' | 'review' | 'quiz'>('study');
  const [progress, setProgress] = useState<{ [key: string]: 'easy' | 'medium' | 'hard' | 'unseen' }>({});
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizMode, setQuizMode] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    setTimer(0);
    setIsTimerRunning(false);
    console.log("Generating flashcards for:", topic);

    try {
      const cards = await generateFlashcards(topic, 10);
      setFlashcards(cards);
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowAnswer(false);
      setQuizMode(false);
      
      // Initialize progress tracking
      const initialProgress: { [key: string]: 'unseen' } = {};
      cards.forEach(card => {
        initialProgress[card.id] = 'unseen';
      });
      setProgress(initialProgress);
      setSessionStats({ correct: 0, incorrect: 0, total: 0 });
      setIsTimerRunning(true);

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
      setShowAnswer(false);
    } else {
      // Session completed
      setIsTimerRunning(false);
      const stats = getProgressStats();
      toast({
        title: "Session Complete!",
        description: `Completed ${stats.total} cards in ${formatTime(timer)}`,
      });
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    toast({
      title: "Cards Shuffled!",
      description: "Flashcards have been randomized.",
    });
  };

  const startQuizMode = () => {
    setQuizMode(true);
    setShowAnswer(false);
    setIsFlipped(false);
    setCurrentIndex(0);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
    setTimer(0);
    setIsTimerRunning(true);
    toast({
      title: "Quiz Mode Started!",
      description: "Answer each card before revealing the solution.",
    });
  };

  const markDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const currentCard = flashcards[currentIndex];
    if (currentCard) {
      setProgress(prev => ({
        ...prev,
        [currentCard.id]: difficulty
      }));
      
      // Update session stats
      setSessionStats(prev => ({
        ...prev,
        [difficulty === 'easy' ? 'correct' : 'incorrect']: prev[difficulty === 'easy' ? 'correct' : 'incorrect'] + 1,
        total: prev.total + 1
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
    setShowAnswer(false);
    setQuizMode(false);
    setTimer(0);
    setIsTimerRunning(false);
    const resetProgress: { [key: string]: 'unseen' } = {};
    flashcards.forEach(card => {
      resetProgress[card.id] = 'unseen';
    });
    setProgress(resetProgress);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
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
              <span>Interactive Flashcard Generator</span>
            </CardTitle>
            <CardDescription>
              Generate AI-powered flashcards with spaced repetition and interactive learning
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
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateFlashcards()}
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
                  Generating Interactive Flashcards...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Flashcards
                </>
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
      {/* Enhanced Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                {topic} Flashcards
                {quizMode && <Badge variant="secondary">Quiz Mode</Badge>}
              </CardTitle>
              <CardDescription>
                Card {currentIndex + 1} of {flashcards.length} • {formatTime(timer)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shuffleCards}>
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
              <Button variant="outline" size="sm" onClick={startQuizMode}>
                <Trophy className="w-4 h-4 mr-2" />
                Quiz Mode
              </Button>
              <Button variant="outline" size="sm" onClick={resetSession}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFlashcards([])}>
                New Topic
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">Easy: {stats.easy}</Badge>
              <Badge variant="secondary">Medium: {stats.medium}</Badge>
              <Badge variant="secondary">Hard: {stats.hard}</Badge>
              <Badge variant="outline">Remaining: {stats.total - stats.completed}</Badge>
              {sessionStats.total > 0 && (
                <>
                  <Badge className="bg-green-100 text-green-800">Correct: {sessionStats.correct}</Badge>
                  <Badge className="bg-red-100 text-red-800">Review: {sessionStats.incorrect}</Badge>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Flashcard */}
      <Card className="min-h-[350px] sm:min-h-[450px] relative overflow-hidden">
        <CardContent className="flex flex-col h-full p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <Badge 
              variant={currentCard.difficulty === 'easy' ? 'secondary' : 
                      currentCard.difficulty === 'medium' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {currentCard.difficulty}
            </Badge>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{formatTime(timer)}</span>
            </div>
          </div>
          
          <div 
            className="flex-1 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-gray-50 rounded-lg p-4"
            onClick={() => {
              if (quizMode && !showAnswer) {
                setShowAnswer(true);
              } else {
                setIsFlipped(!isFlipped);
              }
            }}
          >
            <div className="text-center space-y-4 w-full">
              <div className="min-h-[200px] sm:min-h-[250px] flex items-center justify-center">
                <p className="text-xl sm:text-2xl lg:text-3xl text-center break-words leading-relaxed font-medium">
                  {(quizMode && !showAnswer) || (!quizMode && !isFlipped) ? currentCard.front : currentCard.back}
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-gray-500">
                  {(quizMode && !showAnswer) || (!quizMode && !isFlipped) ? "Question" : "Answer"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (quizMode && !showAnswer) {
                      setShowAnswer(true);
                    } else {
                      setIsFlipped(!isFlipped);
                    }
                  }}
                >
                  {(quizMode && !showAnswer) || (!quizMode && !isFlipped) ? 
                    <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
              
              <p className="text-xs text-gray-400">
                {quizMode ? "Think, then click to reveal answer" : "Click anywhere to flip"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Navigation and Feedback */}
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
            {currentIndex === flashcards.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        {((quizMode && showAnswer) || (!quizMode && isFlipped)) && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => markDifficulty('easy')}
              className="text-green-600 border-green-600 hover:bg-green-50 transition-all"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Got it!
            </Button>
            <Button
              variant="outline"
              onClick={() => markDifficulty('medium')}
              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 transition-all"
            >
              <Eye className="w-4 h-4 mr-2" />
              Review
            </Button>
            <Button
              variant="outline"
              onClick={() => markDifficulty('hard')}
              className="text-red-600 border-red-600 hover:bg-red-50 transition-all"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Difficult
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardSystem;
