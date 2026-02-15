import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Minimize2, Maximize2, Loader2, AlertCircle, TrendingUp, Lightbulb, HelpCircle, Brain, GraduationCap, PiggyBank } from 'lucide-react';
import { useProcessChatMessage, useGetUserTransactions, useGetBalance } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
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

// Generate visual insights based on query and data
const generateVisualInsight = (query: string, response: string): VisualInsight | undefined => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('spending') || lowerQuery.includes('expense')) {
    return {
      type: 'spending-chart',
      title: 'Your Spending Overview',
      data: [
        { category: 'Food', amount: 5000 },
        { category: 'Transport', amount: 3000 },
        { category: 'Entertainment', amount: 2000 },
        { category: 'Shopping', amount: 4000 },
      ],
    };
  }
  
  if (lowerQuery.includes('balance') || lowerQuery.includes('money')) {
    return {
      type: 'balance-card',
      title: 'Current Balance',
      data: { balance: 25000, change: '+12%' },
    };
  }
  
  return undefined;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const processChatMessage = useProcessChatMessage();
  const { data: transactions } = useGetUserTransactions();
  const { data: balance } = useGetBalance();
  const { format } = useCurrency();

  const context = useMemo(() => ({
    transactions: transactions || [],
    balance: balance || 0,
  }), [transactions, balance]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && scrollContainerRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedMessage,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await processChatMessage.mutateAsync(trimmedMessage);
      
      const visualInsight = generateVisualInsight(trimmedMessage, response.content);

      const assistantMessage: Message = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp,
        visualData: visualInsight,
        disclaimer: response.disclaimer,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response. Please try again.');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try asking your question again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderVisualInsight = (insight: VisualInsight) => {
    switch (insight.type) {
      case 'spending-chart':
        return (
          <Card className="mt-3 bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={insight.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: any) => format(value)}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
      
      case 'balance-card':
        return (
          <Card className="mt-3 bg-gradient-to-br from-primary/10 to-chart-1/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{insight.title}</p>
                  <p className="text-2xl font-bold">{format(insight.data.balance)}</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                  {insight.data.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card 
      className={`fixed bottom-6 right-6 shadow-2xl border-2 border-primary/20 z-50 transition-all duration-300 flex flex-col ${
        isExpanded 
          ? 'w-[min(600px,90vw)] h-[min(700px,85vh)]' 
          : 'w-[min(380px,90vw)] h-[min(500px,80vh)]'
      } max-w-[90vw] max-h-[85vh]`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-primary/10 to-chart-1/10 border-b shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-chart-1 flex items-center justify-center shrink-0">
            <Brain className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base truncate">AI Finance Assistant</CardTitle>
            <p className="text-xs text-muted-foreground truncate">Ask me anything about finance</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
            <div className="text-center space-y-4 max-w-sm">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary/20 to-chart-1/20 flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Welcome!</h3>
                <p className="text-sm text-muted-foreground">
                  I can help you with budgeting, saving, investing, and understanding financial concepts.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("How can I start budgeting?")}
                  className="text-xs h-auto py-2"
                >
                  <Lightbulb className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">Budgeting tips</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("What is SIP investment?")}
                  className="text-xs h-auto py-2"
                >
                  <TrendingUp className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">Learn SIP</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("How to save money?")}
                  className="text-xs h-auto py-2"
                >
                  <PiggyBank className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">Saving strategies</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage("Explain stocks")}
                  className="text-xs h-auto py-2"
                >
                  <GraduationCap className="h-3 w-3 mr-1 shrink-0" />
                  <span className="truncate">Stock basics</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-chart-1 text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  {message.visualData && renderVisualInsight(message.visualData)}
                  {message.disclaimer && (
                    <Alert className="mt-2 py-2 px-3 bg-amber-500/10 border-amber-500/20">
                      <AlertCircle className="h-3 w-3 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-800 dark:text-amber-200 ml-2">
                        {message.disclaimer}
                      </AlertDescription>
                    </Alert>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {processChatMessage.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="p-4 border-t shrink-0">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about budgeting, saving, investing..."
              disabled={processChatMessage.isPending}
              className="flex-1 min-w-0"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || processChatMessage.isPending}
              size="icon"
              className="bg-gradient-to-r from-primary to-chart-1 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Educational purposes only • Not financial advice
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
