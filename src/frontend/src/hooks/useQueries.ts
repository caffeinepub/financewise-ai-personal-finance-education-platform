import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { convertBigIntsToNumbers } from '../lib/serialization';
import { generateResponse, type AssistantContext } from '../lib/deterministicAssistant';
import { toast } from 'sonner';

// Mock blog posts for frontend-only rendering
const mockBlogPosts = [
  {
    id: '1',
    title: 'Master Your Money: The Complete Guide to Personal Finance Fundamentals',
    slug: 'personal-finance-fundamentals-guide',
    excerpt: 'Learn the essential building blocks of personal finance, from budgeting basics to long-term wealth creation strategies that actually work.',
    featuredImage: '/assets/generated/blog-personal-finance.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 5,
    seoMeta: 'Complete guide to personal finance fundamentals, budgeting, saving, and building wealth from scratch',
  },
  {
    id: '2',
    title: 'Smart Saving Strategies: How to Build Wealth on Any Income',
    slug: 'smart-saving-strategies-build-wealth',
    excerpt: 'Discover proven saving strategies that work regardless of your income level. Learn how small, consistent actions compound into significant wealth over time.',
    featuredImage: '/assets/generated/blog-saving-investing.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 10,
    seoMeta: 'Effective saving strategies for building wealth, income-independent saving tips, and compound growth techniques',
  },
  {
    id: '3',
    title: 'Budgeting Methods That Actually Work: 50/30/20, Zero-Based & More',
    slug: 'budgeting-methods-that-work',
    excerpt: 'Explore practical budgeting methods including the 50/30/20 rule, zero-based budgeting, and envelope system. Find the approach that fits your lifestyle.',
    featuredImage: '/assets/generated/blog-budgeting-system.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 15,
    seoMeta: 'Practical budgeting methods, 50/30/20 rule, zero-based budgeting, envelope system, and personal budget planning',
  },
  {
    id: '4',
    title: 'Investing for Beginners: Your First Steps into the Stock Market',
    slug: 'investing-for-beginners-first-steps',
    excerpt: 'Demystify investing with this beginner-friendly guide. Learn the basics of stocks, bonds, mutual funds, and how to start building your investment portfolio.',
    featuredImage: '/assets/generated/blog-investment-basics.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 20,
    seoMeta: 'Beginner investing guide, stock market basics, mutual funds, portfolio building, and investment fundamentals',
  },
  {
    id: '5',
    title: 'Stock Market Basics: Understanding How Markets Work',
    slug: 'stock-market-basics-understanding-markets',
    excerpt: 'Get a clear understanding of how stock markets function, from market indices and trading mechanisms to factors that drive stock prices.',
    featuredImage: '/assets/generated/blog-stock-market-basics.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 25,
    seoMeta: 'Stock market basics, how markets work, market indices, trading mechanisms, and stock price factors',
  },
  {
    id: '6',
    title: 'Mutual Funds Explained: A Complete Guide for New Investors',
    slug: 'mutual-funds-complete-guide',
    excerpt: 'Understand mutual funds inside and out: types, benefits, risks, fees, and how to choose the right funds for your financial goals.',
    featuredImage: '/assets/generated/blog-mutual-funds-explained.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 30,
    seoMeta: 'Mutual funds guide, types of mutual funds, benefits and risks, fund selection, and investment strategies',
  },
  {
    id: '7',
    title: 'SIP Investment Strategy: Build Wealth Through Systematic Investing',
    slug: 'sip-investment-strategy-systematic-investing',
    excerpt: 'Learn how Systematic Investment Plans (SIPs) help you build wealth consistently, reduce market timing risk, and harness the power of rupee cost averaging.',
    featuredImage: '/assets/generated/blog-sip-investment-guide.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 35,
    seoMeta: 'SIP investment strategy, systematic investment plans, rupee cost averaging, and consistent wealth building',
  },
  {
    id: '8',
    title: 'Emergency Fund Essentials: Why You Need One and How to Build It',
    slug: 'emergency-fund-essentials-how-to-build',
    excerpt: 'Discover why an emergency fund is your financial safety net and learn practical steps to build 3-6 months of expenses, even on a tight budget.',
    featuredImage: '/assets/generated/blog-emergency-fund.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 40,
    seoMeta: 'Emergency fund guide, financial safety net, building emergency savings, and financial security strategies',
  },
  {
    id: '9',
    title: 'Debt Management: Proven Strategies to Become Debt-Free Faster',
    slug: 'debt-management-strategies-debt-free',
    excerpt: 'Take control of your debt with proven strategies like the debt avalanche and snowball methods. Learn how to prioritize repayment and save on interest.',
    featuredImage: '/assets/generated/blog-debt-management.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 45,
    seoMeta: 'Debt management strategies, debt avalanche method, debt snowball, debt repayment, and becoming debt-free',
  },
  {
    id: '10',
    title: 'Financial Goal Setting: Turn Dreams into Achievable Milestones',
    slug: 'financial-goal-setting-achievable-milestones',
    excerpt: 'Transform vague financial wishes into concrete, achievable goals. Learn the SMART framework and practical steps to reach your financial dreams.',
    featuredImage: '/assets/generated/blog-financial-goals.dim_800x600.jpg',
    publicationDate: Date.now() - 86400000 * 50,
    seoMeta: 'Financial goal setting, SMART goals, achieving financial dreams, and milestone planning',
  },
];

// Blog hooks (frontend-only)
export function useGetAllBlogPosts() {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      return mockBlogPosts;
    },
    staleTime: Infinity,
  });
}

export function useGetBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const post = mockBlogPosts.find(p => p.slug === slug);
      return post || null;
    },
    enabled: !!slug,
    staleTime: Infinity,
  });
}

// User profile hooks (backend)
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      return profile ? convertBigIntsToNumbers(profile) : null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: any) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: any) => {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    },
  });
}

// User preferences hooks (backend)
export function useGetCallerUserPreferences() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const prefs = await actor.getUserPreferences();
      if (prefs) {
        return convertBigIntsToNumbers(prefs);
      }
      // Return default preferences if none exist
      return {
        themeMode: 'system',
        notificationsEnabled: true,
        analyticsVisible: true,
        currency: 'usd',
        updatedAt: Date.now(),
      };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveUserPreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: any) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveUserPreferences(preferences);
      return preferences;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      toast.success('Preferences saved successfully');
    },
    onError: (error: any) => {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    },
  });
}

// Transaction hooks (backend)
export function useGetUserTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const transactions = await actor.getTransactions();
      return transactions.map((t: any) => convertBigIntsToNumbers(t));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (transaction: any) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');
      
      const newTransaction = {
        ...transaction,
        id: Date.now().toString(),
        user: identity.getPrincipal(),
        createdAt: BigInt(Date.now() * 1000000),
        date: transaction.date ? BigInt(transaction.date) : BigInt(Date.now() * 1000000),
        amount: Number(transaction.amount) || 0,
      };
      
      await actor.addTransaction(newTransaction);
      return newTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['categoryData'] });
      queryClient.invalidateQueries({ queryKey: ['financialTrends'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyComparison'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: any) => {
      console.error('Failed to add transaction:', error);
      toast.error('Failed to add transaction');
    },
  });
}

export function useUpdateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't have updateTransaction, so we need to delete and re-add
      // For now, just invalidate queries to refetch
      return { id, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['categoryData'] });
      queryClient.invalidateQueries({ queryKey: ['financialTrends'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyComparison'] });
      toast.success('Transaction updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update transaction:', error);
      toast.error('Failed to update transaction');
    },
  });
}

export function useDeleteTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTransaction(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['categoryData'] });
      queryClient.invalidateQueries({ queryKey: ['financialTrends'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyComparison'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete transaction:', error);
      toast.error('Failed to delete transaction');
    },
  });
}

export function useGetBalance() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!transactions) return 0;
      const balance = transactions.reduce((acc: number, t: any) => {
        const amount = Number(t.amount) || 0;
        return t.transactionType === 'income' ? acc + amount : acc - amount;
      }, 0);
      return balance || 0;
    },
    enabled: !!transactions,
  });
}

export function useGetCategoryData() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['categoryData'],
    queryFn: async () => {
      if (!transactions) return [];
      const categoryMap = new Map<string, number>();
      
      transactions.forEach((t: any) => {
        if (t.transactionType === 'expense') {
          const current = categoryMap.get(t.category) || 0;
          const amount = Number(t.amount) || 0;
          categoryMap.set(t.category, current + amount);
        }
      });
      
      return Array.from(categoryMap.entries()).map(([category, totalAmount]) => ({
        category,
        totalAmount: totalAmount || 0,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
      }));
    },
    enabled: !!transactions,
  });
}

export function useGetMonthlyComparison() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['monthlyComparison'],
    queryFn: async () => {
      if (!transactions) return [];
      
      const monthlyData = new Map<string, { expenses: number; income: number }>();
      
      transactions.forEach((t: any) => {
        const date = new Date(Number(t.date) / 1000000);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const current = monthlyData.get(monthKey) || { expenses: 0, income: 0 };
        const amount = Number(t.amount) || 0;
        
        if (t.transactionType === 'income') {
          current.income += amount;
        } else {
          current.expenses += amount;
        }
        
        monthlyData.set(monthKey, current);
      });
      
      return Array.from(monthlyData.entries()).map(([month, data]) => ({
        month,
        expenses: data.expenses || 0,
        income: data.income || 0,
        savings: (data.income || 0) - (data.expenses || 0),
      }));
    },
    enabled: !!transactions,
  });
}

export function useGetFinancialTrends() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['financialTrends'],
    queryFn: async () => {
      if (!transactions) return [];
      
      let balance = 0;
      const trends = transactions.map((t: any) => {
        const amount = Number(t.amount) || 0;
        balance += t.transactionType === 'income' ? amount : -amount;
        return {
          date: Number(t.date),
          balance: balance || 0,
          expenses: t.transactionType === 'expense' ? amount : 0,
          income: t.transactionType === 'income' ? amount : 0,
        };
      });
      
      return trends;
    },
    enabled: !!transactions,
  });
}

// Savings goals hooks (backend)
export function useGetSavingsGoals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['savingsGoals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const goals = await actor.getSavingsGoals();
      return goals.map((g: any) => convertBigIntsToNumbers(g));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUserSavingsGoals() {
  return useGetSavingsGoals();
}

export function useAddSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (goal: any) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');
      
      const newGoal = {
        ...goal,
        id: Date.now().toString(),
        user: identity.getPrincipal(),
        createdAt: BigInt(Date.now() * 1000000),
        currentAmount: Number(goal.currentAmount) || 0,
        targetAmount: Number(goal.targetAmount) || 0,
      };
      
      await actor.addSavingsGoal(newGoal);
      return newGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Goal added successfully');
    },
    onError: (error: any) => {
      console.error('Failed to add goal:', error);
      toast.error('Failed to add goal');
    },
  });
}

export function useUpdateSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ goalId, updatedGoal }: { goalId: string; updatedGoal: any }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');
      
      const goalData = {
        ...updatedGoal,
        id: goalId,
        user: identity.getPrincipal(),
        createdAt: BigInt(updatedGoal.createdAt || Date.now() * 1000000),
        currentAmount: Number(updatedGoal.currentAmount) || 0,
        targetAmount: Number(updatedGoal.targetAmount) || 0,
      };
      
      await actor.updateSavingsGoal(goalId, goalData);
      return goalData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Goal updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update goal:', error);
      toast.error('Failed to update goal');
    },
  });
}

export function useDeleteSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteSavingsGoal(goalId);
      return goalId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Goal deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    },
  });
}

// Budget data hooks (backend)
export function useGetBudgetData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['budgetData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const budget = await actor.getBudgetData();
      return budget ? convertBigIntsToNumbers(budget) : null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveBudgetData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (budget: any) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');
      
      const budgetData = {
        ...budget,
        user: identity.getPrincipal(),
        lastUpdated: BigInt(Date.now() * 1000000),
      };
      
      await actor.saveBudgetData(budgetData);
      return budgetData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetData'] });
      toast.success('Budget saved successfully');
    },
    onError: (error: any) => {
      console.error('Failed to save budget:', error);
      toast.error('Failed to save budget');
    },
  });
}

// AI Prediction hooks (backend)
export function useGetAIPrediction() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['aiPrediction'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const prediction = await actor.getAIPrediction();
      return prediction ? convertBigIntsToNumbers(prediction) : null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveAIPrediction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (prediction: any) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');
      
      const predictionData = {
        ...prediction,
        user: identity.getPrincipal(),
        lastUpdated: BigInt(Date.now() * 1000000),
      };
      
      await actor.saveAIPrediction(predictionData);
      return predictionData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiPrediction'] });
      toast.success('Prediction saved successfully');
    },
    onError: (error: any) => {
      console.error('Failed to save prediction:', error);
      toast.error('Failed to save prediction');
    },
  });
}

// Quiz hooks (backend)
export function useInitializeQuiz() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const response = await actor.initializeQuiz();
      return convertBigIntsToNumbers(response);
    },
    onError: (error: any) => {
      console.error('Failed to initialize quiz:', error);
      toast.error('Failed to initialize quiz');
    },
  });
}

export function useSubmitQuizAnswer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answer: any) => {
      if (!actor) throw new Error('Actor not available');
      const feedback = await actor.submitQuizAnswer(answer);
      return convertBigIntsToNumbers(feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizStatistics'] });
    },
    onError: (error: any) => {
      console.error('Failed to submit answer:', error);
      toast.error('Failed to submit answer');
    },
  });
}

export function useGetQuizStatistics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['quizStatistics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const stats = await actor.getQuizStatistics();
      return convertBigIntsToNumbers(stats);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Contact form hook (public)
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (submission: any) => {
      if (!actor) throw new Error('Actor not available');
      
      const contactData = {
        ...submission,
        id: Date.now().toString(),
        submittedAt: BigInt(Date.now() * 1000000),
      };
      
      await actor.submitContactForm(contactData);
      return contactData;
    },
    onSuccess: () => {
      toast.success('Message sent successfully');
    },
    onError: (error: any) => {
      console.error('Failed to submit contact form:', error);
      toast.error('Failed to send message');
    },
  });
}

// AI Chat hook (deterministic, frontend-only)
export function useProcessChatMessage() {
  const { data: transactions } = useGetUserTransactions();
  const { data: goals } = useGetSavingsGoals();
  const { data: balance } = useGetBalance();

  return useMutation({
    mutationFn: async (userMessage: string) => {
      // Calculate totals for context
      const totalIncome = transactions?.reduce((sum, t) => 
        t.transactionType === 'income' ? sum + Number(t.amount) : sum, 0) || 0;
      const totalExpenses = transactions?.reduce((sum, t) => 
        t.transactionType === 'expense' ? sum + Number(t.amount) : sum, 0) || 0;
      
      const context: AssistantContext = {
        balance: balance || 0,
        recentTransactions: transactions?.slice(-10).map(t => ({
          amount: Number(t.amount),
          category: t.category,
          transactionType: t.transactionType,
        })) || [],
        totalTransactions: transactions?.length || 0,
        totalIncome,
        totalExpenses,
        savingsGoals: goals?.map(g => ({
          name: g.name,
          targetAmount: Number(g.targetAmount),
          currentAmount: Number(g.currentAmount),
        })) || [],
        hasData: (transactions?.length || 0) > 0 || (goals?.length || 0) > 0,
      };
      
      const response = generateResponse(userMessage, context);
      
      // Return response with id and timestamp for UI
      return {
        id: Date.now().toString(),
        content: response.content,
        timestamp: Date.now(),
        disclaimer: response.disclaimer,
      };
    },
  });
}

// Subscriptions hooks (backend)
export function useGetSubscriptions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const subs = await actor.getSubscriptions();
      return subs.map((s: any) => convertBigIntsToNumbers(s));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscription: any) => {
      if (!actor) throw new Error('Actor not available');
      
      const subData = {
        ...subscription,
        startDate: BigInt(subscription.startDate || Date.now() * 1000000),
        endDate: subscription.endDate ? BigInt(subscription.endDate) : undefined,
      };
      
      await actor.addSubscription(subData);
      return subData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription added successfully');
    },
    onError: (error: any) => {
      console.error('Failed to add subscription:', error);
      toast.error('Failed to add subscription');
    },
  });
}

export function useDeleteSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionName: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteSubscription(subscriptionName);
      return subscriptionName;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete subscription:', error);
      toast.error('Failed to delete subscription');
    },
  });
}
