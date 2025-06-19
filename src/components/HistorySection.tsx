
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Search, Calendar, MessageSquare, HelpCircle, Trash2, Download } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "@/hooks/use-toast";

const HistorySection: React.FC = () => {
  const { history, getHistoryByDate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Group history by date
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: typeof history } = {};
    
    history.forEach(entry => {
      const dateKey = entry.timestamp.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    
    return groups;
  }, [history]);

  // Filter history based on search term
  const filteredHistory = useMemo(() => {
    if (!searchTerm) return history;
    
    return history.filter(entry =>
      entry.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.response?.explanation && entry.response.explanation.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [history, searchTerm]);

  // Get unique dates for date filter
  const availableDates = useMemo(() => {
    return Object.keys(groupedHistory).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedHistory]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'query':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'question_generation':
        return <HelpCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eduMentor-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "History Exported",
      description: "Your query history has been downloaded as a JSON file.",
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('eduMentor_history');
    window.location.reload();
  };

  const displayHistory = selectedDate 
    ? getHistoryByDate(selectedDate)
    : searchTerm 
      ? filteredHistory 
      : history;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Query History</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Your learning journey with {history.length} total queries
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" onClick={exportHistory}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={clearHistory}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your query history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Dates</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {formatDate(new Date(date))} ({groupedHistory[date].length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Content */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="grouped">Date Grouped</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {displayHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm sm:text-base text-center">
                  {searchTerm || selectedDate 
                    ? "No queries found matching your criteria." 
                    : "No query history yet. Start asking questions to build your learning timeline!"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {displayHistory.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        {getTypeIcon(entry.type)}
                        <CardTitle className="text-sm sm:text-lg line-clamp-2">
                          {entry.query}
                        </CardTitle>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                        {formatTime(entry.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{formatDate(entry.timestamp)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {entry.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  {entry.response?.explanation && (
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs sm:text-sm line-clamp-3">
                        {entry.response.explanation.substring(0, 200)}...
                      </CardDescription>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="grouped" className="space-y-6">
          {availableDates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm sm:text-base text-center">
                  No query history yet. Start asking questions to build your learning timeline!
                </p>
              </CardContent>
            </Card>
          ) : (
            availableDates.map(date => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>{formatDate(new Date(date))}</span>
                    <Badge variant="secondary">
                      {groupedHistory[date].length} queries
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {groupedHistory[date].map((entry) => (
                      <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        {getTypeIcon(entry.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 line-clamp-1">
                            {entry.query}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatTime(entry.timestamp)}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {entry.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistorySection;
