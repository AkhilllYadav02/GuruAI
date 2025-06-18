
import { useState } from "react";
import Header from "@/components/Header";
import QueryInput from "@/components/QueryInput";
import Dashboard from "@/components/Dashboard";
import QuestionGenerator from "@/components/QuestionGenerator";
import ResourceCard from "@/components/ResourceCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Award, Calendar, Badge } from "lucide-react";

const Index = () => {
  const [savedTopics, setSavedTopics] = useState<string[]>([]);

  const handleSaveTopic = (topic: string) => {
    if (!savedTopics.includes(topic)) {
      setSavedTopics([...savedTopics, topic]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            EduMentor AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">Your Personalized AI Study Companion</p>
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex items-center space-x-2 text-blue-600">
              <Book className="w-6 h-6" />
              <span className="font-medium">Smart Learning</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Award className="w-6 h-6" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <Badge className="w-6 h-6" />
              <span className="font-medium">Progress Tracking</span>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="query">Ask AI</TabsTrigger>
            <TabsTrigger value="questions">Practice</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="w-6 h-6 text-blue-600" />
                  <span>Smart Query System</span>
                </CardTitle>
                <CardDescription>
                  Ask any question and get personalized explanations, resources, and study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QueryInput onSaveTopic={handleSaveTopic} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-green-600" />
                  <span>AI Question Generator</span>
                </CardTitle>
                <CardDescription>
                  Generate custom practice questions on any topic with instant feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                title="Newton's Laws of Motion"
                description="Comprehensive guide to understanding fundamental physics principles"
                type="article"
                url="#"
                difficulty="intermediate"
              />
              <ResourceCard 
                title="Photosynthesis Explained"
                description="Visual breakdown of how plants convert sunlight into energy"
                type="video"
                url="#"
                difficulty="beginner"
              />
              <ResourceCard 
                title="Calculus Fundamentals"
                description="Step-by-step introduction to differential and integral calculus"
                type="interactive"
                url="#"
                difficulty="advanced"
              />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard savedTopics={savedTopics} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
