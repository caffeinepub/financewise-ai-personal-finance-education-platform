import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { generateDeterministicResponse } from '../lib/deterministicAssistant';
import { convertBigIntsToNumbers } from '../lib/serialization';

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

// Helper to get principal-scoped storage key
function getPrincipalKey(baseKey: string, principal?: string): string {
  if (!principal) return baseKey;
  return `${baseKey}_${principal}`;
}

// Blog hooks
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

// User profile hooks
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// User preferences hooks with principal-scoped localStorage
export function useGetCallerUserPreferences() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['userPreferences', principal],
    queryFn: async () => {
      const key = getPrincipalKey('userPreferences', principal);
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      return {
        themeMode: 'system',
        notificationsEnabled: true,
        analyticsVisible: true,
        currency: 'usd',
        updatedAt: Date.now(),
      };
    },
    enabled: !!principal,
  });
}

export function useSaveUserPreferences() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async (preferences: any) => {
      const safePrefs = convertBigIntsToNumbers(preferences);
      const key = getPrincipalKey('userPreferences', principal);
      localStorage.setItem(key, JSON.stringify(safePrefs));
      return safePrefs;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences', principal] });
    },
  });
}

// Transaction hooks with principal-scoped localStorage
export function useGetUserTransactions() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['transactions', principal],
    queryFn: async () => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      if (!stored) return [];
      
      try {
        const transactions = JSON.parse(stored);
        return transactions.map((t: any) => ({
          ...t,
          amount: Number(t.amount) || 0,
          date: typeof t.date === 'string' ? Number(t.date) : t.date,
          createdAt: typeof t.createdAt === 'string' ? Number(t.createdAt) : t.createdAt,
        }));
      } catch (error) {
        console.error('Failed to parse transactions:', error);
        return [];
      }
    },
    enabled: !!principal,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async (transaction: any) => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      
      const newTransaction = convertBigIntsToNumbers({
        ...transaction,
        id: Date.now().toString(),
        createdAt: Date.now() * 1000000,
        date: transaction.date || Date.now() * 1000000,
        amount: Number(transaction.amount) || 0,
      });
      
      transactions.push(newTransaction);
      localStorage.setItem(key, JSON.stringify(transactions));
      return newTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', principal] });
      queryClient.invalidateQueries({ queryKey: ['balance', principal] });
      queryClient.invalidateQueries({ queryKey: ['categoryData', principal] });
      queryClient.invalidateQueries({ queryKey: ['financialTrends', principal] });
      queryClient.invalidateQueries({ queryKey: ['monthlyComparison', principal] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      const index = transactions.findIndex((t: any) => t.id === id);
      if (index !== -1) {
        transactions[index] = convertBigIntsToNumbers({ ...transactions[index], ...updates });
        localStorage.setItem(key, JSON.stringify(transactions));
      }
      return transactions[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', principal] });
      queryClient.invalidateQueries({ queryKey: ['balance', principal] });
      queryClient.invalidateQueries({ queryKey: ['categoryData', principal] });
      queryClient.invalidateQueries({ queryKey: ['financialTrends', principal] });
      queryClient.invalidateQueries({ queryKey: ['monthlyComparison', principal] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async (id: string) => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      const filtered = transactions.filter((t: any) => t.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions', principal] });
      queryClient.invalidateQueries({ queryKey: ['balance', principal] });
      queryClient.invalidateQueries({ queryKey: ['categoryData', principal] });
      queryClient.invalidateQueries({ queryKey: ['financialTrends', principal] });
      queryClient.invalidateQueries({ queryKey: ['monthlyComparison', principal] });
    },
  });
}

export function useGetBalance() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['balance', principal],
    queryFn: async () => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      const balance = transactions.reduce((acc: number, t: any) => {
        const amount = Number(t.amount) || 0;
        return t.transactionType === 'income' ? acc + amount : acc - amount;
      }, 0);
      return balance || 0;
    },
    enabled: !!principal,
  });
}

export function useGetCategoryData() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['categoryData', principal],
    queryFn: async () => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
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
    enabled: !!principal,
  });
}

export function useGetMonthlyComparison() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['monthlyComparison', principal],
    queryFn: async () => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      
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
    enabled: !!principal,
  });
}

export function useGetFinancialTrends() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['financialTrends', principal],
    queryFn: async () => {
      const key = getPrincipalKey('transactions', principal);
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      
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
    enabled: !!principal,
  });
}

// Savings goals hooks with principal-scoped localStorage
export function useGetSavingsGoals() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useQuery({
    queryKey: ['savingsGoals', principal],
    queryFn: async () => {
      const key = getPrincipalKey('savingsGoals', principal);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!principal,
  });
}

export function useGetUserSavingsGoals() {
  return useGetSavingsGoals();
}

export function useAddSavingsGoal() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async (goal: any) => {
      const key = getPrincipalKey('savingsGoals', principal);
      const stored = localStorage.getItem(key);
      const goals = stored ? JSON.parse(stored) : [];
      const newGoal = {
        ...goal,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      goals.push(newGoal);
      localStorage.setItem(key, JSON.stringify(goals));
      return newGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals', principal] });
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const key = getPrincipalKey('savingsGoals', principal);
      const stored = localStorage.getItem(key);
      const goals = stored ? JSON.parse(stored) : [];
      const index = goals.findIndex((g: any) => g.id === id);
      if (index !== -1) {
        goals[index] = { ...goals[index], ...updates };
        localStorage.setItem(key, JSON.stringify(goals));
      }
      return goals[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals', principal] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();

  return useMutation({
    mutationFn: async (id: string) => {
      const key = getPrincipalKey('savingsGoals', principal);
      const stored = localStorage.getItem(key);
      const goals = stored ? JSON.parse(stored) : [];
      const filtered = goals.filter((g: any) => g.id !== id);
      localStorage.setItem(key, JSON.stringify(filtered));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals', principal] });
    },
  });
}

// Contact form hook (mock implementation)
export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async (formData: any) => {
      console.log('Contact form submitted:', formData);
      return { success: true, message: 'Thank you for your message!' };
    },
  });
}

// AI/Chat hooks with deterministic assistant and data-aware context
export function useProcessChatMessage() {
  const { data: transactions } = useGetUserTransactions();
  const { data: balance } = useGetBalance();
  const { data: goals } = useGetSavingsGoals();

  return useMutation({
    mutationFn: async (message: string) => {
      // Compute aggregates for context
      const totalIncome = transactions?.filter(t => t.transactionType === 'income').reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalExpenses = transactions?.filter(t => t.transactionType === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0;
      
      const context = {
        balance: balance || 0,
        recentTransactions: transactions || [],
        totalTransactions: transactions?.length || 0,
        totalIncome,
        totalExpenses,
        savingsGoals: goals || [],
        hasData: (transactions && transactions.length > 0) || (goals && goals.length > 0),
      };

      const response = generateDeterministicResponse(message, context);

      return {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: response.content,
        timestamp: Date.now(),
        disclaimer: response.disclaimer || 'Educational purposes only. Not financial advice.',
      };
    },
  });
}

export function useTrainAIModel() {
  return useMutation({
    mutationFn: async () => {
      return { success: true, message: 'Model training simulated' };
    },
  });
}

export function useGetAIPrediction() {
  return useQuery({
    queryKey: ['aiPrediction'],
    queryFn: async () => {
      return null;
    },
  });
}

export function useGetQuizStatistics() {
  return useQuery({
    queryKey: ['quizStatistics'],
    queryFn: async () => {
      return {
        totalQuestions: 100,
        questionsCompleted: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        currentDifficulty: 'easy',
        progressPercentage: 0,
      };
    },
  });
}
