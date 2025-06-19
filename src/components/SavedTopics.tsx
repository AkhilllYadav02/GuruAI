
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Search, Trash2, Calendar, Eye, Download } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "@/hooks/use-toast";

const SavedTopics: React.FC = () => {
  const { savedTopics, removeSavedTopic } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  const filteredTopics = savedTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.response?.explanation && topic.response.explanation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRemoveTopic = (id: string) => {
    removeSavedTopic(id);
    toast({
      title: "Topic Removed",
      description: "The saved topic has been removed from your collection.",
    });
  };

  const exportTopics = () => {
    const dataStr = JSON.stringify(savedTopics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eduMentor-saved-topics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Topics Exported",
      description: "Your saved topics have been downloaded as a JSON file.",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Saved Topics</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Your curated learning collection ({savedTopics.length} topics)
          </p>
        </div>
        {savedTopics.length > 0 && (
          <Button variant="outline" size="sm" onClick={exportTopics}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        )}
      </div>

      {/* Search */}
      {savedTopics.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search saved topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
      )}

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm sm:text-base text-center mb-4">
              {searchTerm 
                ? "No saved topics found matching your search." 
                : "No saved topics yet. Start asking questions and save interesting topics to build your personal knowledge library!"
              }
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-sm sm:text-lg line-clamp-2 flex-1">
                    {topic.title}
                  </CardTitle>
                  <div className="flex space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTopic(topic)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTopic(topic.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Saved on {formatDate(topic.savedAt)}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {topic.response?.explanation && (
                  <CardDescription className="text-xs sm:text-sm line-clamp-3 mb-3">
                    {topic.response.explanation.substring(0, 150)}...
                  </CardDescription>
                )}
                <div className="flex flex-wrap gap-2">
                  {topic.response?.difficulty && (
                    <Badge variant="secondary" className="text-xs">
                      {topic.response.difficulty}
                    </Badge>
                  )}
                  {topic.response?.estimatedTime && (
                    <Badge variant="outline" className="text-xs">
                      {topic.response.estimatedTime}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-lg sm:text-xl">{selectedTopic.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTopic(null)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Saved on {formatDate(selectedTopic.savedAt)}</span>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTopic.response?.explanation && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Explanation</h4>
                    <Textarea
                      value={selectedTopic.response.explanation}
                      readOnly
                      className="min-h-[200px] text-sm leading-relaxed resize-none"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedTopic.response.difficulty && (
                      <Badge variant="secondary">
                        {selectedTopic.response.difficulty}
                      </Badge>
                    )}
                    {selectedTopic.response.estimatedTime && (
                      <Badge variant="outline">
                        {selectedTopic.response.estimatedTime}
                      </Badge>
                    )}
                  </div>

                  {selectedTopic.response.resources && (
                    <div>
                      <h4 className="font-medium mb-2">Resources</h4>
                      <div className="space-y-2">
                        {selectedTopic.response.resources.map((resource: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <h5 className="font-medium text-sm">{resource.title}</h5>
                            <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {resource.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SavedTopics;
