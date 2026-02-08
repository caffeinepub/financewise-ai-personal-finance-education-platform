import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Coins, 
  BookOpen, 
  Receipt, 
  Brain, 
  Heart, 
  CheckCircle2, 
  X, 
  RefreshCw,
  TrendingUp,
  Target,
  Award,
  Flame
} from 'lucide-react';

type ChallengeStatus = 'pending' | 'completed' | 'skipped';

interface TodayChallenge {
  id: string;
  text: string;
  points: number;
  category: string;
  status: ChallengeStatus;
}

const predefinedChallenges: Omit<TodayChallenge, 'status'>[] = [
  { id: '1', text: 'Save ₹100', points: 10, category: 'saving' },
  { id: '2', text: 'Learn 1 tip', points: 5, category: 'learning' },
  { id: '3', text: 'Track expenses', points: 5, category: 'habit' },
  { id: '4', text: 'Save ₹200', points: 20, category: 'saving' },
  { id: '5', text: 'No unnecessary spending today', points: 8, category: 'habit' },
  { id: '6', text: 'Read "What is Budgeting?"', points: 10, category: 'learning' },
];

export default function Challenges() {
  const [todayChallenges, setTodayChallenges] = useState<TodayChallenge[]>([
    { ...predefinedChallenges[0], status: 'pending' },
    { ...predefinedChallenges[1], status: 'pending' },
    { ...predefinedChallenges[2], status: 'pending' },
  ]);

  const handleComplete = (id: string) => {
    setTodayChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'completed' } : c))
    );
  };

  const handleSkip = (id: string) => {
    setTodayChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'skipped' } : c))
    );
  };

  const handleChooseAnother = (id: string) => {
    const currentIndex = predefinedChallenges.findIndex(c => c.id === todayChallenges.find(tc => tc.id === id)?.id);
    const nextIndex = (currentIndex + 1) % predefinedChallenges.length;
    const newChallenge = predefinedChallenges[nextIndex];
    
    setTodayChallenges(prev =>
      prev.map(c => (c.id === id ? { ...newChallenge, status: 'pending' } : c))
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'saving':
        return <Coins className="w-5 h-5" />;
      case 'learning':
        return <BookOpen className="w-5 h-5" />;
      case 'habit':
        return <Receipt className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-xl">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Challenges
            </h1>
            <p className="text-muted-foreground">Build better money habits, one challenge at a time</p>
          </div>
        </div>

        {/* No Investment Banner */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No Investment Required</h3>
                <p className="text-sm text-muted-foreground">
                  All challenges are safe, simple, and habit-based. Perfect for building financial discipline without any risk.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Challenges */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Today's Challenges
              </CardTitle>
              <CardDescription>Complete these to earn points and build streaks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayChallenges.map((challenge) => (
            <Card key={challenge.id} className={`border ${
              challenge.status === 'completed' ? 'border-green-500/50 bg-green-500/5' :
              challenge.status === 'skipped' ? 'border-muted bg-muted/20' :
              'border-border'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      challenge.status === 'completed' ? 'bg-green-500/20' :
                      challenge.status === 'skipped' ? 'bg-muted' :
                      'bg-primary/10'
                    }`}>
                      {getCategoryIcon(challenge.category)}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        challenge.status === 'completed' ? 'line-through text-muted-foreground' :
                        challenge.status === 'skipped' ? 'line-through text-muted-foreground' :
                        ''
                      }`}>
                        {challenge.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {challenge.points} pts
                        </Badge>
                        {challenge.status === 'completed' && (
                          <Badge className="text-xs bg-green-500">Completed</Badge>
                        )}
                        {challenge.status === 'skipped' && (
                          <Badge variant="secondary" className="text-xs">Skipped</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {challenge.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleComplete(challenge.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSkip(challenge.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Skip
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleChooseAnother(challenge.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Challenge Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Saving */}
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Coins className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>Saving</CardTitle>
            </div>
            <CardDescription>Build your savings habit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Save ₹50, ₹100, ₹200, ₹500, ₹1000</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Save for 3 days straight</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Save daily for 7 / 30 days</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Learning */}
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Learning</CardTitle>
            </div>
            <CardDescription>Expand your financial knowledge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Read 1 finance tip</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Learn "What is Budgeting?"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Learn "Emergency Fund"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Complete 1 quiz / 5 learning tasks</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Expense Control */}
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Receipt className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle>Expense Control</CardTitle>
            </div>
            <CardDescription>Track and manage spending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Track expenses today</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>No unnecessary spending today</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Reduce food expenses today</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Categorize spending</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Financial Habits */}
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Financial Habits</CardTitle>
            </div>
            <CardDescription>Develop smart money routines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Set a daily saving goal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Review yesterday's expenses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Plan tomorrow's budget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Identify 1 money leak</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Discipline & Mindfulness */}
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-500/10 rounded-lg">
                <Brain className="w-6 h-6 text-pink-500" />
              </div>
              <CardTitle>Discipline & Mindfulness</CardTitle>
            </div>
            <CardDescription>Build mental strength</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Think before spending today</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Delay a purchase by 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Write 1 saving reason</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Spend mindfully today</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Motivation */}
        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
              <CardTitle>Why Users Stay Engaged</CardTitle>
            </div>
            <CardDescription>Benefits of challenges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>No risk or investment fear</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Daily small wins</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Gamified saving experience</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Builds real habits</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Points & Levels Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              Points System
            </CardTitle>
            <CardDescription>How you earn points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>Save ₹50</span>
                <Badge variant="outline">5 pts</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>Save ₹100</span>
                <Badge variant="outline">10 pts</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>Save ₹200</span>
                <Badge variant="outline">20 pts</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>Read tip / Track expenses</span>
                <Badge variant="outline">5 pts</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>Complete lesson</span>
                <Badge variant="outline">10 pts</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>Complete quiz</span>
                <Badge variant="outline">15 pts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Streaks & Bonuses
            </CardTitle>
            <CardDescription>Keep your streak alive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>3-day streak</span>
                <Badge className="bg-orange-500">+10 bonus</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>7-day streak</span>
                <Badge className="bg-orange-500">+30 bonus</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                <span>30-day streak</span>
                <Badge className="bg-orange-500">+150 bonus</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Complete challenges daily to build your streak and earn bonus points!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
