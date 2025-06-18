
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Youtube, FileText, Book } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  type: "video" | "article" | "interactive";
  url: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

const ResourceCard = ({ title, description, type, url, difficulty }: ResourceCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "video":
        return <Youtube className="w-5 h-5 text-red-600" />;
      case "article":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "interactive":
        return <Book className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">{type}</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Open Resource
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
