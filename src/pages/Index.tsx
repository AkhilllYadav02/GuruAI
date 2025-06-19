
import React from "react";
import Header from "@/components/Header";
import QueryInput from "@/components/QueryInput";
import Dashboard from "@/components/Dashboard";
import QuestionGenerator from "@/components/QuestionGenerator";
import RecommendedResources from "@/components/RecommendedResources";
import SavedTopics from "@/components/SavedTopics";
import HistorySection from "@/components/HistorySection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Award, Calendar, Badge, History, Bookmark } from "lucide-react";
import { AppProvider, useAppContext } from "@/contexts/AppContext";

const IndexContent = () => {
  const { savedTopics } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            EduMentor AI
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4">Your Personalized AI Study Companion</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-8 mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center space-x-2 text-blue-600">
              <Book className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Smart Learning</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <Badge className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="font-medium text-xs sm:text-sm lg:text-base">Progress Tracking</span>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 lg:mb-8 h-auto">
            <TabsTrigger value="query" className="text-xs sm:text-sm py-2 sm:py-3">Ask AI</TabsTrigger>
            <TabsTrigger value="questions" className="text-xs sm:text-sm py-2 sm:py-3">Practice</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs sm:text-sm py-2 sm:py-3">Resources</TabsTrigger>
            <TabsTrigger value="saved" className="text-xs sm:text-sm py-2 sm:py-3">
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm py-2 sm:py-3">
              <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2 sm:py-3">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Book className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span>Smart Query System</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Ask any question and get personalized explanations, resources, and study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QueryInput />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span>AI Question Generator</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Generate custom practice questions on any topic with instant feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Book className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  <span>Learning Resources</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Discover curated educational content from top sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendedResources />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                  <span>Saved Topics</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your personal collection of interesting topics and explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SavedTopics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  <span>Query History</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Track your learning journey with detailed query history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HistorySection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <Dashboard savedTopics={savedTopics.map(t => t.title)} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <IndexContent />
    </AppProvider>
  );
};

export default Index;
