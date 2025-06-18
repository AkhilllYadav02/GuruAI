
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
import { generateQuestions } from "@/lib/gemini";

interface Question {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const QuestionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuestionsHandler = async () => {
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
      const aiQuestions = await generateQuestions(topic, difficulty, questionType, 3);
      setQuestions(aiQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setShowResults(false);
      
      toast({
        title: "Questions Generated!",
        description: `Created ${aiQuestions.length} questions for ${topic}.`,
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
      <div className="space-y-4 sm:space-y-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quiz Results</CardTitle>
            <CardDescription>Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {userAnswers[index] === question.correctAnswer ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium text-sm sm:text-base">Question {index + 1}</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-sm sm:text-base break-words">{question.question}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 break-words">
                    <strong>Your answer:</strong> {userAnswers[index] || "Not answered"}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 mb-2 break-words">
                    <strong>Correct answer:</strong> {question.correctAnswer}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 break-words">{question.explanation}</p>
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
              className="mt-6 w-full sm:w-auto"
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
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-base sm:text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          <Badge variant="outline" className="self-start sm:self-auto">{difficulty}</Badge>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg break-words">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "mcq" || currentQuestion.options ? (
              <RadioGroup onValueChange={(value) => submitAnswer(value)}>
                {currentQuestion.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer text-sm sm:text-base break-words leading-relaxed">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                  id="answer-textarea"
                />
                <Button 
                  onClick={() => {
                    const textarea = document.getElementById('answer-textarea') as HTMLTextAreaElement;
                    if (textarea?.value.trim()) {
                      submitAnswer(textarea.value);
                    }
                  }}
                  className="w-full sm:w-auto"
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Topic</label>
          <Input
            placeholder="e.g., Physics, Biology, Math"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <SelectItem value="essay">Essay</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button 
        onClick={generateQuestionsHandler}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white text-base sm:text-lg py-4 sm:py-6"
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
