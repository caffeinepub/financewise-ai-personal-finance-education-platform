import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Lightbulb, Trophy, BookOpen } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDenied from '../components/AccessDenied';
import { defaultQuizQuestions } from '../content/defaultQuizQuestions';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  realLifeTip: string;
  topic: string;
  difficulty: string;
}

export default function Quiz() {
  const { identity } = useInternetIdentity();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const currentQuestion: QuizQuestion | null = defaultQuizQuestions[currentQuestionIndex] || null;

  if (!identity) {
    return <AccessDenied />;
  }

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    setShowFeedback(true);
    setAnsweredQuestions(prev => prev + 1);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < defaultQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setAnsweredQuestions(0);
  };

  const progressPercentage = (answeredQuestions / defaultQuizQuestions.length) * 100;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const isQuizComplete = answeredQuestions === defaultQuizQuestions.length;

  if (isQuizComplete) {
    const percentage = (score / defaultQuizQuestions.length) * 100;
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">
                You've completed all {defaultQuizQuestions.length} questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                  {percentage.toFixed(0)}%
                </div>
                <p className="text-xl text-muted-foreground">
                  {score} out of {defaultQuizQuestions.length} correct
                </p>
                <Progress value={percentage} className="h-3" />
              </div>

              <div className="grid gap-4 mt-8">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Performance</p>
                  <p className="text-lg font-semibold">
                    {percentage >= 80 ? '🌟 Excellent!' : percentage >= 60 ? '👍 Good Job!' : '💪 Keep Learning!'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleRestart} className="flex-1 bg-gradient-to-r from-primary to-chart-1">
                  Restart Quiz
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Finance Quiz</h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            Question {currentQuestionIndex + 1} of {defaultQuizQuestions.length}
          </Badge>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Score: {score}/{answeredQuestions}</span>
                <span className="text-muted-foreground">
                  {answeredQuestions > 0 ? `${((score / answeredQuestions) * 100).toFixed(0)}% correct` : ''}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex gap-2 mb-2">
              <Badge variant="outline">{currentQuestion.topic}</Badge>
              <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            </div>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === option
                      ? showFeedback
                        ? option === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : 'border-primary bg-primary/10'
                      : showFeedback && option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border hover:border-primary/50'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showFeedback && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {showFeedback && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className="space-y-4 pt-4 border-t">
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Real-Life Tip</p>
                      <p className="text-sm text-muted-foreground">{currentQuestion.realLifeTip}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {!showFeedback ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1 bg-gradient-to-r from-primary to-chart-1"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="flex-1 bg-gradient-to-r from-primary to-chart-1"
                >
                  {currentQuestionIndex < defaultQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
