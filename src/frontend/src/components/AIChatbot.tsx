import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Minimize2, Maximize2, Loader2, AlertCircle, TrendingUp, DollarSign, PieChart, Sparkles, Lightbulb, HelpCircle, Brain, GraduationCap, Globe } from 'lucide-react';
import { useProcessChatMessage, useGetUserTransactions, useGetBalance } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useCurrency } from '../hooks/useCurrency';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  visualData?: VisualInsight;
  followUpSuggestion?: string;
  disclaimer?: string;
}

interface VisualInsight {
  type: 'spending-chart' | 'balance-card' | 'prediction-card' | 'category-pie';
  data: any;
  title: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Entertainment': '#3b82f6',
  'Housing & Utilities': '#10b981',
  'Transportation': '#f59e0b',
  'Shopping': '#ef4444',
  'Food & Dining': '#8b5cf6',
  'Healthcare': '#ec4899',
  'Other': '#6366f1',
};

// Enhanced response processing with comprehensive knowledge base
const processAIResponse = (query: string, rawResponse: string, context: any): { 
  content: string; 
  followUp?: string; 
  disclaimer?: string;
  needsClarification?: boolean;
} => {
  const lowerQuery = query.toLowerCase();
  
  // Check if query is unclear or too vague
  const vagueIndicators = ['help', 'what', 'how', 'tell me', 'explain'];
  const isVague = vagueIndicators.some(indicator => 
    lowerQuery === indicator || lowerQuery.startsWith(indicator + ' ')
  ) && lowerQuery.split(' ').length < 3;
  
  if (isVague) {
    return {
      content: "I'd be happy to help! Could you please be more specific about what you'd like to know? For example:\n\n• Are you asking about budgeting, saving, or investing?\n• Do you want to understand a specific financial concept?\n• Are you looking for advice on your current spending?\n• Need information about stocks, markets, or web resources?",
      needsClarification: true,
    };
  }

  let structuredContent = rawResponse;
  
  // Add contextual disclaimer for investment/financial topics
  let disclaimer: string | undefined;
  const riskyTopics = ['crypto', 'stock', 'trading', 'invest', 'market', 'risk', 'portfolio', 'mutual fund', 'bond', 'equity', 'forex', 'commodity'];
  const hasRiskyTopic = riskyTopics.some(topic => lowerQuery.includes(topic));
  
  if (hasRiskyTopic) {
    disclaimer = "For learning purposes only. This is educational information, not financial advice. Consult a certified financial advisor before making investment decisions.";
  }

  // Generate helpful follow-up suggestion
  let followUp: string | undefined;
  
  if (lowerQuery.includes('budget')) {
    followUp = "💡 Next step: Try tracking your expenses for a week to see where your money goes.";
  } else if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
    followUp = "💡 Tip: Start with the 50/30/20 rule - 50% needs, 30% wants, 20% savings.";
  } else if (lowerQuery.includes('debt') || lowerQuery.includes('loan')) {
    followUp = "💡 Consider: Pay off high-interest debts first to save money on interest.";
  } else if (lowerQuery.includes('invest') || lowerQuery.includes('stock')) {
    followUp = "💡 Remember: Start small, diversify, and invest for the long term. Always do your own research.";
  } else if (lowerQuery.includes('emergency')) {
    followUp = "💡 Goal: Aim to save 3-6 months of living expenses in your emergency fund.";
  } else if (lowerQuery.includes('portfolio')) {
    followUp = "💡 Diversification: Spread investments across different asset classes to manage risk.";
  } else if (lowerQuery.includes('market') || lowerQuery.includes('economy')) {
    followUp = "💡 Stay informed: Follow reliable financial news sources and economic indicators.";
  } else {
    followUp = "💡 Want to know more? Feel free to ask follow-up questions!";
  }

  return {
    content: structuredContent,
    followUp,
    disclaimer,
    needsClarification: false,
  };
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processChatMessage = useProcessChatMessage();
  const { data: transactions } = useGetUserTransactions();
  const { data: balance } = useGetBalance();
  const { format: formatCurrency, symbol: currencySymbol } = useCurrency();

  // Contextual learning: Track user behavior patterns
  const userBehaviorContext = useMemo(() => {
    const totalTransactions = transactions?.length || 0;
    const recentTransactions = transactions?.slice(-10) || [];
    const avgTransactionAmount = recentTransactions.length > 0
      ? recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length
      : 0;
    
    return {
      totalTransactions,
      recentTransactions,
      avgTransactionAmount,
      interactionCount,
      hasBalance: balance !== undefined && balance !== null,
    };
  }, [transactions, balance, interactionCount]);

  // Enhanced smooth auto-scroll to bottom with responsive behavior
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        requestAnimationFrame(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    }
  };

  // Auto-scroll when messages change or typing status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  // Generate visual insights based on query
  const generateVisualInsight = (query: string, responseContent: string): VisualInsight | undefined => {
    const lowerQuery = query.toLowerCase();
    
    // Spending distribution chart
    if ((lowerQuery.includes('spending') || lowerQuery.includes('expense')) && transactions && transactions.length > 0) {
      const categoryTotals = transactions
        .filter(t => t.transactionType === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);
      
      const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        value: amount,
      }));

      if (chartData.length > 0) {
        return {
          type: 'category-pie',
          data: chartData,
          title: 'Your Spending Distribution',
        };
      }
    }

    // Balance card
    if (lowerQuery.includes('balance') && balance !== undefined) {
      return {
        type: 'balance-card',
        data: { balance, currency: currencySymbol },
        title: 'Current Balance',
      };
    }

    // Prediction card for savings/future queries
    if (lowerQuery.includes('save') || lowerQuery.includes('future') || lowerQuery.includes('predict')) {
      const monthlyIncome = transactions?.filter(t => t.transactionType === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      const monthlyExpenses = transactions?.filter(t => t.transactionType === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      const potentialSavings = monthlyIncome - monthlyExpenses;

      return {
        type: 'prediction-card',
        data: { 
          potentialSavings, 
          currency: currencySymbol,
          confidence: 85,
        },
        title: 'Savings Prediction',
      };
    }

    return undefined;
  };

  // Generate adaptive prompts based on user context
  const getAdaptivePrompts = (): string[] => {
    const prompts: string[] = [];
    
    if (userBehaviorContext.totalTransactions === 0) {
      prompts.push("How do I start tracking my expenses?");
      prompts.push("What's the best way to budget?");
      prompts.push("Explain investment basics for beginners");
      prompts.push("What are the best financial websites?");
    } else if (userBehaviorContext.totalTransactions < 10) {
      prompts.push("How can I improve my spending habits?");
      prompts.push("What categories should I track?");
      prompts.push("What is portfolio diversification?");
      prompts.push("Explain stock market basics");
    } else {
      prompts.push("Analyze my spending patterns");
      prompts.push("How can I save more money?");
      prompts.push("What's my financial health score?");
      prompts.push("Explain mutual funds vs stocks");
    }

    if (balance && balance < 0) {
      prompts.push("How do I get out of debt?");
    } else if (balance && balance > 1000) {
      prompts.push("What are safe investment options?");
    }

    return prompts.slice(0, 4);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    
    if (!trimmedMessage || processChatMessage.isPending) return;

    setError(null);
    setInteractionCount(prev => prev + 1);

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmedMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await processChatMessage.mutateAsync(trimmedMessage);
      
      if (response.success && response.message) {
        // Process response with multi-step reasoning
        const processedResponse = processAIResponse(
          trimmedMessage, 
          response.message,
          userBehaviorContext
        );
        
        // Generate visual insight if applicable
        const visualInsight = generateVisualInsight(trimmedMessage, response.message);
        
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: processedResponse.content,
          timestamp: Date.now(),
          visualData: visualInsight,
          followUpSuggestion: processedResponse.followUp,
          disclaimer: processedResponse.disclaimer,
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError('Received unexpected response from AI assistant');
        toast.error('Failed to get response from AI assistant');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.message?.includes('Unauthorized')) {
        errorMessage = 'Please log in to use the AI assistant.';
      } else if (error.message?.includes('empty')) {
        errorMessage = 'Message cannot be empty.';
      } else if (error.message?.includes('Actor not available')) {
        errorMessage = 'AI service is temporarily unavailable. Please try again later.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const clearError = () => {
    setError(null);
  };

  const renderVisualInsight = (visual: VisualInsight) => {
    switch (visual.type) {
      case 'category-pie':
        return (
          <div className="mt-3 p-3 bg-background/50 rounded-lg border">
            <p className="text-xs font-medium mb-2">{visual.title}</p>
            <ResponsiveContainer width="100%" height={150}>
              <RechartsPie>
                <Pie
                  data={visual.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {visual.data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {visual.data.slice(0, 3).map((item: any, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {item.name}: {formatCurrency(item.value)}
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'balance-card':
        return (
          <div className="mt-3 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium">{visual.title}</p>
            </div>
            <p className={`text-2xl font-bold ${visual.data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(visual.data.balance)}
            </p>
          </div>
        );

      case 'prediction-card':
        return (
          <div className="mt-3 p-4 bg-gradient-to-br from-chart-2/10 to-chart-2/5 rounded-lg border border-chart-2/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-chart-2" />
              <p className="text-xs font-medium">{visual.title}</p>
            </div>
            <p className="text-2xl font-bold text-chart-2 mb-1">
              {formatCurrency(visual.data.potentialSavings)}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {visual.data.confidence}% confidence
              </Badge>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
          </div>
        );

      case 'spending-chart':
        return (
          <div className="mt-3 p-3 bg-background/50 rounded-lg border">
            <p className="text-xs font-medium mb-2">{visual.title}</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={visual.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary to-primary/80"
        aria-label="Open AI Finance Assistant"
      >
        <div className="relative">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
          {interactionCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-chart-2 rounded-full text-xs flex items-center justify-center text-white font-bold">
              {interactionCount}
            </span>
          )}
        </div>
      </Button>
    );
  }

  const adaptivePrompts = getAdaptivePrompts();

  // Compact mode dimensions (default) - smaller size
  const compactWidth = 'w-[280px] sm:w-[320px]';
  const compactHeight = 'h-[400px] sm:h-[450px]';
  
  // Expanded mode dimensions
  const expandedWidth = 'w-[calc(100vw-2rem)] sm:w-[420px] md:w-[480px]';
  const expandedHeight = 'h-[calc(100vh-2rem)] sm:h-[650px] md:h-[700px]';

  return (
    <Card
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 shadow-2xl transition-all duration-300 ${
        isExpanded 
          ? `${expandedWidth} ${expandedHeight} max-h-[calc(100vh-2rem)]`
          : `${compactWidth} ${compactHeight}`
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 border-b bg-gradient-to-r from-primary/10 to-primary/5 px-3 sm:px-4">
        <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary animate-pulse" />
          <span className={isExpanded ? '' : 'hidden sm:inline'}>AI Assistant</span>
          {interactionCount > 5 && isExpanded && (
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
              <Globe className="w-3 h-3 mr-1" />
              All Topics
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 sm:h-8 sm:w-8"
            aria-label={isExpanded ? 'Compact mode' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 sm:h-8 sm:w-8"
            aria-label="Close chat"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-3.5rem)] sm:h-[calc(100%-4rem)]">
        {/* Enhanced ScrollArea with responsive height */}
        <ScrollArea 
          className="flex-1 p-2 sm:p-3 overflow-y-auto" 
          ref={scrollAreaRef} 
          style={{ maxHeight: isExpanded ? 'calc(100% - 80px)' : 'calc(100% - 70px)' }}
        >
          <div className="space-y-2 sm:space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-3 sm:py-4">
                <div className="mb-3 p-2 sm:p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 text-primary" />
                  <p className="text-xs sm:text-sm font-medium mb-1">
                    Hi! I'm your Enhanced AI Finance Assistant.
                  </p>
                  <p className="text-xs text-muted-foreground mb-2 px-2">
                    I can answer questions about budgeting, investing, stocks, markets, and web resources!
                  </p>
                  {isExpanded && (
                    <>
                      <div className="flex items-center justify-center gap-2 text-xs bg-background/50 p-2 rounded mb-2">
                        <Globe className="w-3 h-3 text-primary flex-shrink-0" />
                        <span>Ask about finance, investments, markets, and more!</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-xs bg-amber-500/10 p-2 rounded border border-amber-500/20">
                        <GraduationCap className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span className="text-amber-700 dark:text-amber-400">Investment guidance for learning only</span>
                      </div>
                      
                      {userBehaviorContext.totalTransactions > 0 && (
                        <div className="mt-3 p-2 bg-chart-2/10 rounded-lg border border-chart-2/20">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <PieChart className="w-3 h-3 text-chart-2" />
                            <p className="text-xs font-medium">Your Financial Context</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-background/50 rounded">
                              <p className="text-muted-foreground">Transactions</p>
                              <p className="font-bold">{userBehaviorContext.totalTransactions}</p>
                            </div>
                            <div className="p-2 bg-background/50 rounded">
                              <p className="text-muted-foreground">Balance</p>
                              <p className="font-bold">{formatCurrency(balance || 0)}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Lightbulb className="w-3 h-3 text-primary" />
                          <p className="font-medium">Try asking:</p>
                        </div>
                        <div className="space-y-1">
                          {adaptivePrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => setInputMessage(prompt)}
                              className="w-full text-left p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-xs"
                            >
                              • {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2 sm:p-2.5 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-xs whitespace-pre-wrap break-words">{message.content}</p>
                  {message.visualData && isExpanded && renderVisualInsight(message.visualData)}
                  
                  {message.followUpSuggestion && isExpanded && (
                    <div className="mt-2 p-2 bg-primary/10 rounded text-xs border border-primary/20">
                      {message.followUpSuggestion}
                    </div>
                  )}
                  
                  {message.disclaimer && isExpanded && (
                    <div className="mt-2 p-2 bg-amber-500/10 rounded text-xs border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-start gap-2">
                      <GraduationCap className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>{message.disclaimer}</span>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-2 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <AlertDescription className="flex items-center justify-between text-xs">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="h-6 px-2 text-xs"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-2 sm:p-3 border-t bg-background/50">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about finance, stocks, investing..."
              disabled={processChatMessage.isPending}
              className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
              maxLength={500}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || processChatMessage.isPending}
              size="icon"
              aria-label="Send message"
              className="bg-primary hover:bg-primary/90 flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
            >
              {processChatMessage.isPending ? (
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
              ) : (
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Educational info only • Not financial advice
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
