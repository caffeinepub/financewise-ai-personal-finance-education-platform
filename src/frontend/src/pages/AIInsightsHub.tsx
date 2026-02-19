import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Send, Loader2, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { useGetUserTransactions, useGetSavingsGoals, useGetCallerUserPreferences } from '../hooks/useQueries';
import { generateResponse, type AssistantContext } from '../lib/deterministicAssistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function AIInsightsHub() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to the AI Insights Hub! 🎯

I'm your personal financial assistant. I can help you with:

• **Budgeting & Planning** - Create budgets, track expenses, allocate funds
• **Saving Strategies** - Build emergency funds, save on tight budgets
• **Investing Basics** - Learn about SIPs, mutual funds, stocks
• **Expense Control** - Reduce spending, cut costs, optimize finances
• **Goal Setting** - Plan and achieve your financial goals

Ask me anything about your finances! I'll provide data-driven insights based on your actual transactions, goals, and budget.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: transactions = [] } = useGetUserTransactions();
  const { data: goals = [] } = useGetSavingsGoals();
  const { data: preferences } = useGetCallerUserPreferences();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare context from user data
    const totalIncome = transactions
      .filter((t) => t.transactionType === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.transactionType === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    const context: AssistantContext = {
      balance,
      recentTransactions: transactions.slice(-10).map((t) => ({
        amount: t.amount,
        category: t.category,
        transactionType: t.transactionType,
      })),
      totalTransactions: transactions.length,
      totalIncome,
      totalExpenses,
      savingsGoals: goals.map((g) => ({
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
      })),
      hasData: transactions.length > 0 || goals.length > 0,
    };

    // Generate response using deterministic assistant
    setTimeout(() => {
      const response = generateResponse(userMessage.content, context);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Calculate quick insights
  const totalIncome = transactions
    .filter((t) => t.transactionType === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.transactionType === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-xl">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            AI Insights Hub
          </h1>
          <p className="text-muted-foreground">Ask questions about your finances and get data-driven answers</p>
        </div>
      </div>

      {/* Quick Insights Cards */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{balance.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-500">{totalIncome.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold text-red-500">{totalExpenses.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-1" />
                <span className="text-2xl font-bold">{savingsRate.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>Chat with AI Assistant</CardTitle>
          <CardDescription>
            Ask me anything about budgeting, saving, investing, or expense management
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your finances..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Questions</CardTitle>
          <CardDescription>Click any question to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'How do I create a monthly budget?',
              'What is the 50/30/20 budgeting rule?',
              'How much should I save each month?',
              'How do I build an emergency fund?',
              'What is SIP investment?',
              'How can I reduce my monthly expenses?',
            ].map((question) => (
              <Button
                key={question}
                variant="outline"
                className="justify-start text-left h-auto py-3"
                onClick={() => {
                  setInput(question);
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
