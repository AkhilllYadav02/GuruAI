
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, FileText, BookOpen, ExternalLink, Search, Filter, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'book';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  rating?: number;
  topics: string[];
  source: string;
}

interface RecommendedResourcesProps {
  topic?: string;
  onResourceClick?: (resource: Resource) => void;
}

const RecommendedResources: React.FC<RecommendedResourcesProps> = ({ topic, onResourceClick }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock curated resources database
  const resourcesDatabase: Resource[] = [
    {
      id: '1',
      title: 'Khan Academy Physics',
      description: 'Comprehensive physics lessons covering mechanics, thermodynamics, and more',
      type: 'interactive',
      url: 'https://www.khanacademy.org/science/physics',
      difficulty: 'beginner',
      duration: '2-3 hours',
      rating: 4.8,
      topics: ['physics', 'mechanics', 'newton', 'laws'],
      source: 'Khan Academy'
    },
    {
      id: '2',
      title: 'MIT OpenCourseWare - Biology',
      description: 'Advanced biology courses from MIT including molecular biology and genetics',
      type: 'article',
      url: 'https://ocw.mit.edu/courses/biology/',
      difficulty: 'advanced',
      duration: '5-10 hours',
      rating: 4.9,
      topics: ['biology', 'molecular', 'genetics', 'photosynthesis'],
      source: 'MIT'
    },
    {
      id: '3',
      title: '3Blue1Brown - Linear Algebra',
      description: 'Visual and intuitive explanations of linear algebra concepts',
      type: 'video',
      url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
      difficulty: 'intermediate',
      duration: '45 minutes',
      rating: 4.9,
      topics: ['mathematics', 'algebra', 'linear', 'vectors'],
      source: 'YouTube'
    },
    {
      id: '4',
      title: 'Coursera - Machine Learning by Andrew Ng',
      description: 'Complete machine learning course covering algorithms and practical applications',
      type: 'interactive',
      url: 'https://www.coursera.org/learn/machine-learning',
      difficulty: 'intermediate',
      duration: '11 weeks',
      rating: 4.7,
      topics: ['machine learning', 'ai', 'algorithms', 'neural networks'],
      source: 'Coursera'
    },
    {
      id: '5',
      title: 'Organic Chemistry Tutor',
      description: 'Step-by-step chemistry problem solving and concept explanations',
      type: 'video',
      url: 'https://www.youtube.com/c/TheOrganicChemistryTutor',
      difficulty: 'beginner',
      duration: '30 minutes',
      rating: 4.6,
      topics: ['chemistry', 'organic', 'reactions', 'molecules'],
      source: 'YouTube'
    },
    {
      id: '6',
      title: 'Calculus: Early Transcendentals',
      description: 'Comprehensive calculus textbook with practice problems',
      type: 'book',
      url: '#',
      difficulty: 'intermediate',
      duration: '200+ pages',
      rating: 4.5,
      topics: ['calculus', 'mathematics', 'derivatives', 'integrals'],
      source: 'Academic Press'
    }
  ];

  useEffect(() => {
    if (topic) {
      filterResourcesByTopic(topic);
    } else {
      setResources(resourcesDatabase);
      setFilteredResources(resourcesDatabase);
    }
  }, [topic]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedType, selectedDifficulty, resources]);

  const filterResourcesByTopic = (searchTopic: string) => {
    setIsLoading(true);
    const topicLower = searchTopic.toLowerCase();
    const relevantResources = resourcesDatabase.filter(resource =>
      resource.topics.some(t => t.includes(topicLower)) ||
      resource.title.toLowerCase().includes(topicLower) ||
      resource.description.toLowerCase().includes(topicLower)
    );
    
    setTimeout(() => {
      setResources(relevantResources);
      setFilteredResources(relevantResources);
      setIsLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    setFilteredResources(filtered);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      case 'article':
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case 'interactive':
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case 'book':
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleResourceClick = (resource: Resource) => {
    if (resource.url === '#') {
      toast({
        title: "Resource Preview",
        description: `This would open: ${resource.title}`,
      });
    } else {
      window.open(resource.url, '_blank');
    }
    
    if (onResourceClick) {
      onResourceClick(resource);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="article">Articles</option>
              <option value="interactive">Interactive</option>
              <option value="book">Books</option>
            </select>
          </div>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredResources.map((resource) => (
            <Card 
              key={resource.id} 
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleResourceClick(resource)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    {getIcon(resource.type)}
                    <CardTitle className="text-sm sm:text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </CardTitle>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {resource.source}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs sm:text-sm line-clamp-3 mb-3">
                  {resource.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{resource.duration}</span>
                  {resource.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{resource.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {resource.topics.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {resource.topics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resource.topics.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredResources.length === 0 && !isLoading && (
        <div className="text-center py-8 sm:py-12">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">No resources found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedDifficulty('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecommendedResources;
