
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const QuestionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuestions = async () => {
    if (!topic || !difficulty || !questionType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating questions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    console.log("Generating questions for:", { topic, difficulty, questionType });

    try {
      // Simulate AI question generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockQuestions = [
        {
          question: `What is the primary concept behind ${topic}?`,
          type: "mcq",
          options: ["Option A: Basic definition", "Option B: Advanced theory", "Option C: Practical application", "Option D: Historical context"],
          correctAnswer: "Option A: Basic definition",
          explanation: "This is the fundamental concept that forms the foundation of understanding."
        },
        {
          question: `Explain the key principles of ${topic} in your own words.`,
          type: "short",
          correctAnswer: "A comprehensive explanation covering the main principles and applications.",
          explanation: "Look for understanding of core concepts and ability to explain in simple terms."
        },
        {
          question: `How does ${topic} apply in real-world scenarios?`,
          type: "long",
          correctAnswer: "A detailed analysis of practical applications with examples.",
          explanation: "This tests deeper understanding and ability to connect theory to practice."
        }
      ];

      setQuestions(mockQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResults(false);
      
      toast({
        title: "Questions Generated!",
        description: `Created ${mockQuestions.length} questions for ${topic}.`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: answer });
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter((q, index) => 
      userAnswers[index] === q.correctAnswer
    ).length;
    
    toast({
      title: "Quiz Complete!",
      description: `You scored ${correctAnswers} out of ${questions.length} questions.`,
    });
  };

  if (showResults) {
    return (
      <div className="space-y-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {userAnswers[index] === question.correctAnswer ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{question.question}</p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Your answer:</strong> {userAnswers[index] || "Not answered"}
                  </p>
                  <p className="text-sm text-green-600 mb-2">
                    <strong>Correct answer:</strong> {question.correctAnswer}
                  </p>
                  <p className="text-sm text-gray-500">{question.explanation}</p>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => {
                setQuestions([]);
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
              }}
              className="mt-6"
            >
              Generate New Questions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <Badge variant="outline">{difficulty}</Badge>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "mcq" ? (
              <RadioGroup onValueChange={(value) => submitAnswer(value)}>
                {currentQuestion.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-[120px]"
                  onChange={(e) => {
                    // Auto-submit after user stops typing for short/long questions
                    const answer = e.target.value;
                    if (answer.trim()) {
                      setTimeout(() => submitAnswer(answer), 1000);
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea?.value.trim()) {
                      submitAnswer(textarea.value);
                    }
                  }}
                >
                  Submit Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Topic</label>
          <Input
            placeholder="e.g., Physics, Biology, Math"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <Select onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Question Type</label>
          <Select onValueChange={setQuestionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mcq">Multiple Choice</SelectItem>
              <SelectItem value="short">Short Answer</SelectItem>
              <SelectItem value="long">Long Form</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={generateQuestions}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white text-lg py-6"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Questions...
          </>
        ) : (
          "Generate Practice Questions"
        )}
      </Button>
    </div>
  );
};

export default QuestionGenerator;
