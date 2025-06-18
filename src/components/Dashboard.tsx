
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Award, Book, Badge as BadgeIcon } from "lucide-react";

interface DashboardProps {
  savedTopics: string[];
}

const Dashboard = ({ savedTopics }: DashboardProps) => {
  const studyStreak = 7;
  const weeklyGoal = 5;
  const completedThisWeek = 3;
  const totalTopicsStudied = 15;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Study Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studyStreak} days</div>
            <p className="text-blue-100 text-sm">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Book className="w-5 h-5" />
              <span>Topics Studied</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTopicsStudied}</div>
            <p className="text-green-100 text-sm">Total completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-purple-100 text-sm">Badges earned</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center space-x-2">
              <BadgeIcon className="w-5 h-5" />
              <span>Weekly Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedThisWeek}/{weeklyGoal}</div>
            <p className="text-orange-100 text-sm">Sessions completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>
            You've completed {completedThisWeek} out of {weeklyGoal} study sessions this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(completedThisWeek / weeklyGoal) * 100} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            {weeklyGoal - completedThisWeek} more sessions to reach your weekly goal!
          </p>
        </CardContent>
      </Card>

      {/* Saved Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Topics</CardTitle>
          <CardDescription>
            Topics you've saved for later review ({savedTopics.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {savedTopics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {topic}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No saved topics yet. Start asking questions to build your study collection!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your latest learning milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                🏆
              </div>
              <div>
                <p className="font-medium">7-Day Streak Master</p>
                <p className="text-sm text-gray-600">Studied for 7 consecutive days</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                📚
              </div>
              <div>
                <p className="font-medium">Knowledge Seeker</p>
                <p className="text-sm text-gray-600">Completed 15 study topics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                🎯
              </div>
              <div>
                <p className="font-medium">Question Master</p>
                <p className="text-sm text-gray-600">Answered 50 practice questions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
