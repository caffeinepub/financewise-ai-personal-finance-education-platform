import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, TrendingUp, AlertCircle, CheckCircle2, Target, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import AccessDenied from '../components/AccessDenied';

type AssessmentQuestion = {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
};

type AssessmentResult = {
  personalityType: string;
  riskTolerance: string;
  description: string;
  traits: { trait: string; score: number; description: string }[];
  recommendations: string[];
};

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    question: 'How do you feel when you see a sale or discount?',
    options: [
      { value: 'a', label: 'I must buy it immediately, even if I don\'t need it', score: 1 },
      { value: 'b', label: 'I consider if I actually need it before buying', score: 3 },
      { value: 'c', label: 'I rarely buy things on sale unless planned', score: 5 },
    ],
  },
  {
    id: 'q2',
    question: 'When you receive unexpected money, what do you do?',
    options: [
      { value: 'a', label: 'Spend it on something fun immediately', score: 1 },
      { value: 'b', label: 'Split between spending and saving', score: 3 },
      { value: 'c', label: 'Save or invest most of it', score: 5 },
    ],
  },
  {
    id: 'q3',
    question: 'How often do you check your bank balance?',
    options: [
      { value: 'a', label: 'Rarely, I avoid looking at it', score: 1 },
      { value: 'b', label: 'Once a week or when needed', score: 3 },
      { value: 'c', label: 'Daily or multiple times per week', score: 5 },
    ],
  },
  {
    id: 'q4',
    question: 'What\'s your approach to budgeting?',
    options: [
      { value: 'a', label: 'I don\'t have a budget', score: 1 },
      { value: 'b', label: 'I have a rough idea of my spending', score: 3 },
      { value: 'c', label: 'I track every expense carefully', score: 5 },
    ],
  },
  {
    id: 'q5',
    question: 'How do you feel about taking financial risks?',
    options: [
      { value: 'a', label: 'Very uncomfortable, I prefer safety', score: 1 },
      { value: 'b', label: 'Comfortable with moderate, calculated risks', score: 3 },
      { value: 'c', label: 'Excited by high-risk, high-reward opportunities', score: 5 },
    ],
  },
  {
    id: 'q6',
    question: 'When making a large purchase, you:',
    options: [
      { value: 'a', label: 'Buy on impulse if I like it', score: 1 },
      { value: 'b', label: 'Research for a few days', score: 3 },
      { value: 'c', label: 'Research extensively and compare options', score: 5 },
    ],
  },
  {
    id: 'q7',
    question: 'How do you handle financial stress?',
    options: [
      { value: 'a', label: 'I tend to spend more to feel better', score: 1 },
      { value: 'b', label: 'I try to address the issue gradually', score: 3 },
      { value: 'c', label: 'I create a plan and tackle it systematically', score: 5 },
    ],
  },
  {
    id: 'q8',
    question: 'What\'s your savings habit?',
    options: [
      { value: 'a', label: 'I save whatever is left at month-end', score: 1 },
      { value: 'b', label: 'I try to save a fixed amount monthly', score: 3 },
      { value: 'c', label: 'I automate savings and invest regularly', score: 5 },
    ],
  },
];

function calculateAssessmentResult(answers: Record<string, string>): AssessmentResult {
  const totalScore = Object.entries(answers).reduce((sum, [questionId, answer]) => {
    const question = assessmentQuestions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.value === answer);
    return sum + (option?.score || 0);
  }, 0);

  const maxScore = assessmentQuestions.length * 5;
  const percentage = (totalScore / maxScore) * 100;

  let personalityType = '';
  let riskTolerance = '';
  let description = '';
  let traits: { trait: string; score: number; description: string }[] = [];
  let recommendations: string[] = [];

  if (percentage >= 80) {
    personalityType = 'Financial Planner';
    riskTolerance = 'Moderate to High';
    description = 'You are highly disciplined with excellent financial habits. You plan ahead, track expenses meticulously, and make informed decisions.';
    traits = [
      { trait: 'Financial Discipline', score: 92, description: 'Excellent at sticking to budgets' },
      { trait: 'Long-term Planning', score: 88, description: 'Strong future orientation' },
      { trait: 'Risk Management', score: 85, description: 'Calculated risk-taker' },
      { trait: 'Emotional Spending', score: 15, description: 'Very low emotional purchases' },
    ];
    recommendations = [
      'Consider diversifying investments for higher returns',
      'Share your financial knowledge with others',
      'Explore advanced investment strategies',
    ];
  } else if (percentage >= 60) {
    personalityType = 'Balanced Investor';
    riskTolerance = 'Moderate';
    description = 'You balance risk and security, making thoughtful financial decisions while staying open to opportunities.';
    traits = [
      { trait: 'Financial Discipline', score: 78, description: 'Good at sticking to budgets' },
      { trait: 'Long-term Planning', score: 72, description: 'Decent future orientation' },
      { trait: 'Risk Management', score: 65, description: 'Comfortable with moderate risk' },
      { trait: 'Emotional Spending', score: 35, description: 'Occasional emotional purchases' },
    ];
    recommendations = [
      'Automate your savings to improve consistency',
      'Create a detailed monthly budget',
      'Learn more about investment options',
    ];
  } else if (percentage >= 40) {
    personalityType = 'Cautious Spender';
    riskTolerance = 'Low to Moderate';
    description = 'You are careful with money but could benefit from more structured financial planning and risk-taking.';
    traits = [
      { trait: 'Financial Discipline', score: 55, description: 'Needs improvement' },
      { trait: 'Long-term Planning', score: 48, description: 'Limited future planning' },
      { trait: 'Risk Management', score: 42, description: 'Risk-averse' },
      { trait: 'Emotional Spending', score: 52, description: 'Moderate emotional purchases' },
    ];
    recommendations = [
      'Start tracking all expenses for one month',
      'Set up automatic savings transfers',
      'Learn about low-risk investment options',
      'Create an emergency fund',
    ];
  } else {
    personalityType = 'Impulsive Spender';
    riskTolerance = 'High (Unintentional)';
    description = 'You tend to make spontaneous financial decisions. Building better habits and awareness will significantly improve your financial health.';
    traits = [
      { trait: 'Financial Discipline', score: 32, description: 'Needs significant improvement' },
      { trait: 'Long-term Planning', score: 28, description: 'Very limited planning' },
      { trait: 'Risk Management', score: 25, description: 'High unintentional risk' },
      { trait: 'Emotional Spending', score: 75, description: 'High emotional purchases' },
    ];
    recommendations = [
      'Implement the 24-hour rule for all purchases',
      'Unsubscribe from promotional emails',
      'Set up automatic bill payments',
      'Start with a simple budget (50/30/20 rule)',
      'Seek financial education resources',
    ];
  }

  return {
    personalityType,
    riskTolerance,
    description,
    traits,
    recommendations,
  };
}

export default function MoneyPsychology() {
  const { identity } = useInternetIdentity();
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');

  if (!identity) {
    return <AccessDenied />;
  }

  const handleStartAssessment = () => {
    setShowAssessment(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAssessmentResult(null);
    setSelectedOption('');
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption('');

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Assessment complete
      const result = calculateAssessmentResult(newAnswers);
      setAssessmentResult(result);
      setShowAssessment(false);
    }
  };

  const handleRetakeAssessment = () => {
    handleStartAssessment();
  };

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  // Show assessment interface
  if (showAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">Financial Personality Assessment</CardTitle>
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                <RadioGroup value={selectedOption} onValueChange={handleAnswerSelect}>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          selectedOption === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                        onClick={() => handleAnswerSelect(option.value)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleNextQuestion}
                disabled={!selectedOption}
              >
                {currentQuestionIndex < assessmentQuestions.length - 1 ? 'Next Question' : 'Complete Assessment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show results or default view
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Money Psychology
          </h1>
          <p className="text-muted-foreground">Self Awareness - Understand your financial behavior with real-time insights</p>
        </div>

        {assessmentResult ? (
          <>
            {/* Personality Overview */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Brain className="w-6 h-6 text-primary" />
                  Your Financial Personality
                </CardTitle>
                <CardDescription className="text-base">
                  Based on your assessment responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-card border-2 border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Personality Type</p>
                    <p className="text-3xl font-bold text-primary">{assessmentResult.personalityType}</p>
                    <p className="text-sm text-muted-foreground mt-3">{assessmentResult.description}</p>
                  </div>
                  <div className="p-6 rounded-lg bg-card border-2 border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Risk Tolerance</p>
                    <p className="text-3xl font-bold text-chart-1">{assessmentResult.riskTolerance}</p>
                    <p className="text-sm text-muted-foreground mt-3">
                      Your comfort level with financial risk and uncertainty.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personality Traits */}
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Financial Personality Traits
                </CardTitle>
                <CardDescription>Your behavioral patterns and tendencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessmentResult.traits.map((trait, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{trait.trait}</p>
                        <p className="text-sm text-muted-foreground">{trait.description}</p>
                      </div>
                      <span className="text-2xl font-bold text-primary">{trait.score}%</span>
                    </div>
                    <Progress value={trait.score} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>Actionable steps to improve your financial health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {assessmentResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Retake Assessment */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
              <CardHeader>
                <CardTitle>📊 Retake Assessment</CardTitle>
                <CardDescription>
                  Track your progress by retaking the assessment periodically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
                  onClick={handleRetakeAssessment}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Default view - no assessment taken yet */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-chart-1/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Brain className="w-6 h-6 text-primary" />
                  Discover Your Financial Personality
                </CardTitle>
                <CardDescription className="text-base">
                  Take our 8-question assessment to understand your money mindset
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">What You'll Learn:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Your financial personality type</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Your risk tolerance level</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Behavioral patterns and tendencies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>Personalized improvement recommendations</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Assessment Details:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-chart-1 shrink-0 mt-0.5" />
                        <span>8 carefully designed questions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-chart-1 shrink-0 mt-0.5" />
                        <span>Takes only 3-5 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-chart-1 shrink-0 mt-0.5" />
                        <span>Instant results and insights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-chart-1 shrink-0 mt-0.5" />
                        <span>Retake anytime to track progress</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90"
                  onClick={handleStartAssessment}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Information Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-chart-1/20 bg-gradient-to-br from-card to-chart-1/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Understanding Behavior</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-chart-1" />
                    <div>
                      <p className="text-sm">Learn how your psychology affects your financial decisions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/20 bg-gradient-to-br from-card to-green-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Improve Habits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm">Get personalized tips to build better financial habits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Track Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-sm">Retake the assessment to see how you've improved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
