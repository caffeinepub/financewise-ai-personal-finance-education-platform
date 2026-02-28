import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGetQuizStatistics } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Trophy, Target, TrendingUp, Award, Brain } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDenied from '../components/AccessDenied';

export default function Learning() {
  const { identity } = useInternetIdentity();
  const { data: stats } = useGetQuizStatistics();
  const navigate = useNavigate();

  if (!identity) {
    return <AccessDenied />;
  }

  const topics = [
    { name: 'Budgeting', icon: Target, questions: 15, color: 'bg-blue-500' },
    { name: 'Saving', icon: TrendingUp, questions: 15, color: 'bg-green-500' },
    { name: 'Investing', icon: Trophy, questions: 20, color: 'bg-purple-500' },
    { name: 'Planning', icon: Brain, questions: 20, color: 'bg-orange-500' },
    { name: 'Risk Management', icon: Award, questions: 15, color: 'bg-red-500' },
    { name: 'Psychology', icon: BookOpen, questions: 15, color: 'bg-pink-500' },
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete 10 questions', unlocked: (stats?.questionsCompleted || 0) >= 10 },
    { name: 'Knowledge Seeker', description: 'Complete 25 questions', unlocked: (stats?.questionsCompleted || 0) >= 25 },
    { name: 'Finance Expert', description: 'Complete 50 questions', unlocked: (stats?.questionsCompleted || 0) >= 50 },
    { name: 'Perfect Score', description: 'Get 10 correct in a row', unlocked: (stats?.correctAnswers || 0) >= 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning & Quiz</h1>
          <p className="text-muted-foreground">Test your financial knowledge with 100 educational questions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{stats?.totalQuestions || 100}</CardTitle>
              <CardDescription>Total Questions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{stats?.questionsCompleted || 0}</CardTitle>
              <CardDescription>Completed</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{stats?.correctAnswers || 0}</CardTitle>
              <CardDescription>Correct Answers</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Overall quiz completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{stats?.progressPercentage.toFixed(0) || 0}%</span>
              </div>
              <Progress value={stats?.progressPercentage || 0} className="h-3" />
            </div>
            <Button
              size="lg"
              className="w-full mt-6"
              onClick={() => navigate({ to: '/quiz' })}
            >
              Continue Quiz
            </Button>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Topics Covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Card key={topic.name}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${topic.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                        <CardDescription>{topic.questions} questions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.name} className={achievement.unlocked ? 'border-primary' : 'opacity-50'}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Trophy className={`w-8 h-8 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="ml-auto">Unlocked</Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
