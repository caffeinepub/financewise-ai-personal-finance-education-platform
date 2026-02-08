import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetQuizQuestion, useSubmitQuizAnswer, useGetQuizStatistics } from '../hooks/useQueries';
import { useInitializeDefaultContent } from '../hooks/useDefaultContentInitialization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Lightbulb, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import AccessDenied from '../components/AccessDenied';

export default function Quiz() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: currentQuestion, refetch, isLoading: questionLoading } = useGetQuizQuestion();
  const { data: statistics, isLoading: statsLoading, refetch: refetchStats } = useGetQuizStatistics();
  const submitAnswer = useSubmitQuizAnswer();
  const initializeContent = useInitializeDefaultContent();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  useEffect(() => {
    if (!currentQuestion && !questionLoading) {
      refetch();
    }
  }, [currentQuestion, questionLoading, refetch]);

  useEffect(() => {
    if (initializeContent.isSuccess) {
      setTimeout(() => {
        refetch();
        refetchStats();
      }, 500);
    }
  }, [initializeContent.isSuccess, refetch, refetchStats]);

  if (!identity) {
    return <AccessDenied />;
  }

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const result = await submitAnswer.mutateAsync({
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
    });

    setFeedback(result);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setShowFeedback(false);
    setFeedback(null);
    refetch();
  };

  const handleInitialize = async () => {
    await initializeContent.mutateAsync();
  };

  // Show initialization prompt if no questions available
  if (!questionLoading && !statsLoading && statistics && statistics.totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <CardTitle className="text-2xl">Quiz Not Available Yet</CardTitle>
              </div>
              <CardDescription>
                The quiz database needs to be initialized with questions. Click below to load 100 educational finance questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  This will initialize the quiz with 100 questions covering budgeting, saving, investing, debt management, and more financial topics.
                </p>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handleInitialize}
                disabled={initializeContent.isPending}
              >
                {initializeContent.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2"></div>
                    Initializing Quiz...
                  </>
                ) : (
                  'Initialize Quiz Database'
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: '/learning' })}
              >
                Back to Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show completion screen if all questions answered
  if (!currentQuestion && statistics && statistics.totalQuestions > 0) {
    const finalScore = statistics.totalQuestions > 0 
      ? Math.round((Number(statistics.correctAnswers) / statistics.totalQuestions) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">🎉 Quiz Complete!</CardTitle>
              <CardDescription className="text-center">
                You've completed all available questions. Great job!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Questions</p>
                  <p className="text-3xl font-bold">{statistics.totalQuestions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold text-green-500">{Number(statistics.correctAnswers)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Final Score</p>
                  <p className="text-3xl font-bold text-primary">{finalScore}%</p>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: '/learning' })}
              >
                Back to Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (questionLoading || statsLoading || !currentQuestion || !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = statistics.totalQuestions > 0 
    ? (Number(statistics.questionsCompleted) / statistics.totalQuestions) * 100 
    : 0;

  const accuracyPercentage = Number(statistics.questionsCompleted) > 0 
    ? Math.round((Number(statistics.correctAnswers) / Number(statistics.questionsCompleted)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold">Finance Quiz</h1>
            <Button variant="outline" onClick={() => navigate({ to: '/learning' })}>
              Back to Learning
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">
                    {Number(statistics.questionsCompleted)} / {statistics.totalQuestions}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Correct: {Number(statistics.correctAnswers)}</span>
                  <span>Accuracy: {accuracyPercentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {currentQuestion.topic}
              </span>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-chart-1/10 text-chart-1">
                {currentQuestion.difficulty}
              </span>
            </div>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showFeedback && setSelectedAnswer(option)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    showFeedback
                      ? option === feedback?.correctAnswer
                        ? 'border-green-500 bg-green-500/10'
                        : option === selectedAnswer && !feedback?.isCorrect
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-border bg-muted/50'
                      : selectedAnswer === option
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showFeedback && option === feedback?.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {showFeedback && option === selectedAnswer && !feedback?.isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback Section */}
            {showFeedback && feedback && (
              <div className={`p-4 rounded-lg border-2 ${
                feedback.isCorrect
                  ? 'border-green-500/20 bg-green-500/10'
                  : 'border-red-500/20 bg-red-500/10'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-lg mb-2">{feedback.encouragement}</p>
                    <p className="text-sm mb-3">{feedback.explanation}</p>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-card/50">
                      <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold mb-1">Real-Life Tip:</p>
                        <p className="text-sm text-muted-foreground">{feedback.realLifeTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!showFeedback ? (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || submitAnswer.isPending}
                >
                  {submitAnswer.isPending ? 'Submitting...' : 'Submit Answer'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleNext}
                >
                  Next Question
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
