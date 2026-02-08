import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';
import {
  Currency,
  QuizDifficulty,
  QuizTopic,
} from '../types/backend-types';
import type {
  UserPreferences,
  TransactionData,
  SavingsGoal,
  ContactSubmission,
  AIPrediction,
  BlogPost,
  BlogPreview,
  QuizQuestion,
  QuizProgress,
  ChatMessage,
  ChatRole,
} from '../types/backend-types';
import {
  getCurrentTimestamp,
  serializeUserProfile,
  serializeUserPreferences,
  serializeTransaction,
  serializeSavingsGoal,
  serializeQuizProgress,
  serializeChatMessage,
  serializeContactSubmission,
  convertBigIntsToNumbers,
  bigIntToNumber,
  numberToBigInt,
} from '../lib/serialization';
import { generateDeterministicResponse } from '../lib/deterministicAssistant';
import { generateAdsenseArticle } from '../lib/blog/generateAdsenseArticle';
import { loadCachedContent, saveCachedContent } from '../lib/blog/blogContentCache';
import {
  loadQuizProgress,
  saveQuizProgress as saveQuizProgressToStorage,
  initializeQuizProgress,
  markQuestionAsked,
  updateProgressAfterAnswer,
} from '../lib/quizProgressStorage';

// ============================================
// USER PROFILE QUERIES
// ============================================

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const profile = await actor.getCallerUserProfile();
        return profile ? convertBigIntsToNumbers(profile) : null;
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    retryDelay: 1000,
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available. Please ensure you are logged in.');
      const serializedProfile = serializeUserProfile(profile);
      return actor.saveCallerUserProfile(serializedProfile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: any) => {
      console.error('Save profile error:', error);
      toast.error(error.message || 'Failed to save profile');
    },
  });
}

// ============================================
// USER PREFERENCES QUERIES (Mock - Backend Missing)
// ============================================

export function useGetUserPreferences() {
  const { identity } = useInternetIdentity();

  return useQuery<UserPreferences | null>({
    queryKey: ['userPreferences', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      try {
        const stored = localStorage.getItem(`prefs_${identity.getPrincipal().toString()}`);
        if (stored) {
          return JSON.parse(stored);
        }
        return {
          themeMode: 'dark',
          notificationsEnabled: true,
          analyticsVisible: true,
          currency: Currency.inr,
          updatedAt: Date.now(),
        };
      } catch (error: any) {
        console.error('Failed to fetch preferences:', error);
        return null;
      }
    },
    enabled: !!identity,
    retry: 2,
  });
}

export const useGetCallerUserPreferences = useGetUserPreferences;

export function useSaveUserPreferences() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      localStorage.setItem(`prefs_${identity.getPrincipal().toString()}`, JSON.stringify(preferences));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
      toast.success('Preferences saved successfully');
    },
    onError: (error: any) => {
      console.error('Save preferences error:', error);
      toast.error(error.message || 'Failed to save preferences');
    },
  });
}

export const useUpdateCallerUserPreferences = useSaveUserPreferences;

// ============================================
// TRANSACTION QUERIES (Mock - Backend Missing)
// ============================================

export function useGetUserTransactions() {
  const { identity } = useInternetIdentity();

  return useQuery<TransactionData[]>({
    queryKey: ['transactions', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return [];
      try {
        const stored = localStorage.getItem(`transactions_${identity.getPrincipal().toString()}`);
        return stored ? JSON.parse(stored) : [];
      } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        return [];
      }
    },
    enabled: !!identity,
    retry: 2,
  });
}

export function useAddTransaction() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionData | any) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      
      // Convert bigint to number if needed
      const normalizedTransaction: TransactionData = {
        ...transaction,
        date: typeof transaction.date === 'bigint' ? Number(transaction.date) : transaction.date,
        createdAt: typeof transaction.createdAt === 'bigint' ? Number(transaction.createdAt) : transaction.createdAt,
      };
      
      const key = `transactions_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      transactions.push(normalizedTransaction);
      localStorage.setItem(key, JSON.stringify(transactions));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Transaction added successfully');
    },
    onError: (error: any) => {
      console.error('Add transaction error:', error);
      toast.error(error.message || 'Failed to add transaction');
    },
  });
}

export function useUpdateTransaction() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionData | any) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      
      // Convert bigint to number if needed
      const normalizedTransaction: TransactionData = {
        ...transaction,
        date: typeof transaction.date === 'bigint' ? Number(transaction.date) : transaction.date,
        createdAt: typeof transaction.createdAt === 'bigint' ? Number(transaction.createdAt) : transaction.createdAt,
      };
      
      const key = `transactions_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      const index = transactions.findIndex((t: TransactionData) => t.id === normalizedTransaction.id);
      if (index !== -1) {
        transactions[index] = normalizedTransaction;
        localStorage.setItem(key, JSON.stringify(transactions));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Transaction updated successfully');
    },
    onError: (error: any) => {
      console.error('Update transaction error:', error);
      toast.error(error.message || 'Failed to update transaction');
    },
  });
}

export function useDeleteTransaction() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      const key = `transactions_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      const transactions = stored ? JSON.parse(stored) : [];
      const filtered = transactions.filter((t: TransactionData) => t.id !== transactionId);
      localStorage.setItem(key, JSON.stringify(filtered));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success('Transaction deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete transaction error:', error);
      toast.error(error.message || 'Failed to delete transaction');
    },
  });
}

// ============================================
// SAVINGS GOALS QUERIES (Mock - Backend Missing)
// ============================================

export function useGetSavingsGoals() {
  const { identity } = useInternetIdentity();

  return useQuery<SavingsGoal[]>({
    queryKey: ['savingsGoals', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return [];
      try {
        const stored = localStorage.getItem(`goals_${identity.getPrincipal().toString()}`);
        return stored ? JSON.parse(stored) : [];
      } catch (error: any) {
        console.error('Failed to fetch savings goals:', error);
        return [];
      }
    },
    enabled: !!identity,
    retry: 2,
  });
}

export const useGetUserSavingsGoals = useGetSavingsGoals;

export function useAddSavingsGoal() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: SavingsGoal) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      const key = `goals_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      const goals = stored ? JSON.parse(stored) : [];
      goals.push(goal);
      localStorage.setItem(key, JSON.stringify(goals));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Goal added successfully');
    },
    onError: (error: any) => {
      console.error('Add goal error:', error);
      toast.error(error.message || 'Failed to add goal');
    },
  });
}

export function useUpdateSavingsGoal() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedGoal: SavingsGoal) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      const key = `goals_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      const goals = stored ? JSON.parse(stored) : [];
      const index = goals.findIndex((g: SavingsGoal) => g.id === updatedGoal.id);
      if (index !== -1) {
        goals[index] = updatedGoal;
        localStorage.setItem(key, JSON.stringify(goals));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Goal updated successfully');
    },
    onError: (error: any) => {
      console.error('Update goal error:', error);
      toast.error(error.message || 'Failed to update goal');
    },
  });
}

export function useDeleteSavingsGoal() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      const key = `goals_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      const goals = stored ? JSON.parse(stored) : [];
      const filtered = goals.filter((g: SavingsGoal) => g.id !== goalId);
      localStorage.setItem(key, JSON.stringify(filtered));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success('Goal deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete goal error:', error);
      toast.error(error.message || 'Failed to delete goal');
    },
  });
}

// ============================================
// AI PREDICTIONS QUERIES (Mock - Backend Missing)
// ============================================

export function useGetAIPrediction() {
  const { identity } = useInternetIdentity();

  return useQuery<AIPrediction | null>({
    queryKey: ['aiPrediction', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      try {
        const stored = localStorage.getItem(`prediction_${identity.getPrincipal().toString()}`);
        return stored ? JSON.parse(stored) : null;
      } catch (error: any) {
        console.error('Failed to fetch AI prediction:', error);
        return null;
      }
    },
    enabled: !!identity,
    retry: 1,
  });
}

export function useSaveAIPrediction() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prediction: AIPrediction) => {
      if (!identity) throw new Error('Please ensure you are logged in.');
      localStorage.setItem(`prediction_${identity.getPrincipal().toString()}`, JSON.stringify(prediction));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiPrediction'] });
    },
    onError: (error: any) => {
      console.error('Failed to save AI prediction:', error);
    },
  });
}

// Mock AI training and prediction hooks
export function useTrainAIModel() {
  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast.success('AI model trained successfully');
    },
  });
}

export function useMakeAIPrediction() {
  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        balancePrediction: 50000,
        riskLevel: 'Low',
        futureSavings: 10000,
        confidenceScore: 85,
      };
    },
  });
}

// ============================================
// CONTACT FORM QUERIES (Mock - Backend Missing)
// ============================================

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      const stored = localStorage.getItem('contact_submissions') || '[]';
      const submissions = JSON.parse(stored);
      submissions.push(submission);
      localStorage.setItem('contact_submissions', JSON.stringify(submissions));
    },
    onSuccess: () => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
    },
    onError: (error: any) => {
      console.error('Submit contact form error:', error);
      toast.error(error.message || 'Failed to send message');
    },
  });
}

// ============================================
// BLOG QUERIES (With Generated Content)
// ============================================

export type ExtendedBlogPost = BlogPost & {
  tags: string[];
  author: string;
  metaDescription: string;
};

export type ExtendedBlogPreview = BlogPreview & {
  tags: string[];
  author: string;
};

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Complete Guide to Monthly Budgeting',
    content: '',
    excerpt: 'Learn how to create and stick to a monthly budget',
    featuredImage: '/assets/generated/blog-monthly-budget.dim_800x600.jpg',
    publicationDate: Date.now() * 1000000,
    slug: 'monthly-budgeting-guide',
    seoMeta: 'budgeting, personal finance',
  },
  {
    id: '2',
    title: 'Building Your Emergency Fund',
    content: '',
    excerpt: 'Essential steps to build a solid emergency fund',
    featuredImage: '/assets/generated/blog-emergency-fund.dim_800x600.jpg',
    publicationDate: Date.now() * 1000000,
    slug: 'emergency-fund-guide',
    seoMeta: 'emergency fund, savings',
  },
];

export function useGetAllBlogPreviews() {
  return useQuery<ExtendedBlogPreview[]>({
    queryKey: ['blogPreviews'],
    queryFn: async () => {
      return mockBlogPosts.map((post) => {
        const cached = loadCachedContent(post.slug);
        const excerpt = cached?.excerpt || post.excerpt;
        
        return {
          id: post.id,
          title: post.title,
          excerpt,
          featuredImage: post.featuredImage,
          publicationDate: post.publicationDate,
          slug: post.slug,
          tags: ['Finance', 'Education', 'Personal Finance'],
          author: 'FinanceWise AI Team',
        };
      });
    },
    retry: 2,
  });
}

export const useGetAllBlogPosts = useGetAllBlogPreviews;

export function useGetLatestBlogPreviews(count: number) {
  return useQuery<ExtendedBlogPreview[]>({
    queryKey: ['latestBlogPreviews', count],
    queryFn: async () => {
      const posts = mockBlogPosts.slice(0, count);
      return posts.map((post) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        publicationDate: post.publicationDate,
        slug: post.slug,
        tags: ['Finance', 'Education'],
        author: 'FinanceWise AI Team',
      }));
    },
    retry: 2,
  });
}

export function useGetBlogPostBySlug(slug: string) {
  return useQuery<ExtendedBlogPost | null>({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const post = mockBlogPosts.find((p) => p.slug === slug);
      if (!post) return null;

      let cached = loadCachedContent(slug);
      
      if (!cached) {
        const generated = generateAdsenseArticle({ title: post.title, slug: post.slug });
        cached = {
          htmlContent: generated.htmlContent,
          excerpt: generated.excerpt,
          wordCount: generated.wordCount,
          generatedAt: Date.now(),
        };
        saveCachedContent(slug, cached);
      }

      return {
        ...post,
        content: cached.htmlContent,
        excerpt: cached.excerpt,
        tags: ['Finance', 'Education', 'Personal Finance'],
        author: 'FinanceWise AI Team',
        metaDescription: cached.excerpt,
      };
    },
    enabled: !!slug,
    retry: 2,
  });
}

export const useGetBlogPost = useGetBlogPostBySlug;

// ============================================
// BALANCE CALCULATION
// ============================================

export function useGetBalance() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery<number>({
    queryKey: ['balance', transactions],
    queryFn: () => {
      if (!transactions || transactions.length === 0) return 0;
      return transactions.reduce((acc, transaction) => {
        const amount = typeof transaction.amount === 'number' ? transaction.amount : Number(transaction.amount);
        if (transaction.transactionType === 'income') {
          return acc + amount;
        } else {
          return acc - amount;
        }
      }, 0);
    },
    enabled: !!transactions,
  });
}

// ============================================
// DERIVED DATA QUERIES
// ============================================

export function useGetCategoryData() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['categoryData', transactions],
    queryFn: () => {
      if (!transactions || transactions.length === 0) return [];
      
      const categoryTotals: Record<string, number> = {};
      transactions
        .filter(t => t.transactionType === 'expense')
        .forEach(t => {
          const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount);
          categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
        });
      
      return Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        totalAmount: amount,
        color: '#3b82f6',
      }));
    },
    enabled: !!transactions,
  });
}

export function useGetMonthlyComparison() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['monthlyComparison', transactions],
    queryFn: () => {
      if (!transactions || transactions.length === 0) return [];
      
      const monthlyData: Record<string, { income: number; expenses: number }> = {};
      
      transactions.forEach(t => {
        const dateValue = typeof t.date === 'number' ? t.date : Number(t.date);
        const date = new Date(dateValue / 1000000);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expenses: 0 };
        }
        
        const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount);
        if (t.transactionType === 'income') {
          monthlyData[monthKey].income += amount;
        } else {
          monthlyData[monthKey].expenses += amount;
        }
      });
      
      return Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({
          month,
          income: data.income,
          expenses: data.expenses,
          savings: data.income - data.expenses,
        }));
    },
    enabled: !!transactions,
  });
}

export function useGetFinancialTrends() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ['financialTrends', transactions],
    queryFn: () => {
      if (!transactions || transactions.length === 0) return [];
      
      const dailyData: Record<string, { balance: number; expenses: number; income: number }> = {};
      let runningBalance = 0;
      
      transactions
        .sort((a, b) => {
          const aDate = typeof a.date === 'number' ? a.date : Number(a.date);
          const bDate = typeof b.date === 'number' ? b.date : Number(b.date);
          return aDate - bDate;
        })
        .forEach(t => {
          const dateValue = typeof t.date === 'number' ? t.date : Number(t.date);
          const date = new Date(dateValue / 1000000);
          const dateKey = date.toISOString().split('T')[0];
          
          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { balance: runningBalance, expenses: 0, income: 0 };
          }
          
          const amount = typeof t.amount === 'number' ? t.amount : Number(t.amount);
          if (t.transactionType === 'income') {
            runningBalance += amount;
            dailyData[dateKey].income += amount;
          } else {
            runningBalance -= amount;
            dailyData[dateKey].expenses += amount;
          }
          dailyData[dateKey].balance = runningBalance;
        });
      
      return Object.entries(dailyData).map(([dateStr, data]) => ({
        date: new Date(dateStr).getTime(),
        balance: data.balance,
        expenses: data.expenses,
        income: data.income,
      }));
    },
    enabled: !!transactions,
  });
}

// ============================================
// CHAT/AI ASSISTANT QUERIES
// ============================================

export function useProcessChatMessage() {
  const { data: transactions } = useGetUserTransactions();
  const { data: balance } = useGetBalance();

  return useMutation({
    mutationFn: async (message: string) => {
      const context = {
        balance,
        recentTransactions: transactions?.slice(-10),
        totalTransactions: transactions?.length || 0,
      };
      
      const response = generateDeterministicResponse(message, context);
      
      return {
        success: true,
        message: response.content,
        disclaimer: response.disclaimer,
      };
    },
    onError: (error: any) => {
      console.error('Chat error:', error);
      toast.error('Failed to process message');
    },
  });
}

// ============================================
// QUIZ QUERIES (With Local Persistence)
// ============================================

const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What percentage of your income should you save according to the 50/30/20 rule?',
    options: ['10%', '20%', '30%', '50%'],
    correctAnswer: '20%',
    explanation: 'The 50/30/20 rule suggests saving 20% of your income.',
    realLifeTip: 'Start with 10% if 20% seems difficult, then gradually increase.',
    topic: QuizTopic.budgeting,
    difficulty: QuizDifficulty.easy,
  },
  {
    id: 'q2',
    question: 'How many months of expenses should an emergency fund cover?',
    options: ['1-2 months', '3-6 months', '12 months', '24 months'],
    correctAnswer: '3-6 months',
    explanation: 'Financial experts recommend 3-6 months of essential expenses.',
    realLifeTip: 'Start with one month and build gradually.',
    topic: QuizTopic.emergencyFunds,
    difficulty: QuizDifficulty.easy,
  },
];

export function useGetQuizQuestion() {
  const { identity } = useInternetIdentity();

  return useQuery<QuizQuestion | null>({
    queryKey: ['quizQuestion', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      
      const principal = identity.getPrincipal().toString();
      let progress = loadQuizProgress(principal) || initializeQuizProgress();
      
      const unanswered = mockQuizQuestions.find(q => !progress.askedQuestions.includes(q.id));
      
      if (unanswered) {
        progress = markQuestionAsked(progress, unanswered.id);
        saveQuizProgressToStorage(principal, progress);
        return unanswered;
      }
      
      return null;
    },
    enabled: !!identity,
  });
}

export function useGetQuizQuestions() {
  return useQuery<QuizQuestion[]>({
    queryKey: ['quizQuestions'],
    queryFn: async () => {
      return mockQuizQuestions;
    },
  });
}

export function useSubmitQuizAnswer() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, userAnswer }: { questionId: string; userAnswer: string }) => {
      if (!identity) throw new Error('Please log in');
      
      const question = mockQuizQuestions.find(q => q.id === questionId);
      if (!question) throw new Error('Question not found');
      
      const isCorrect = userAnswer === question.correctAnswer;
      const principal = identity.getPrincipal().toString();
      let progress = loadQuizProgress(principal) || initializeQuizProgress();
      
      progress = updateProgressAfterAnswer(progress, isCorrect, mockQuizQuestions.length);
      saveQuizProgressToStorage(principal, progress);
      
      return {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        realLifeTip: question.realLifeTip,
        encouragement: isCorrect ? '🎉 Correct! Well done!' : '💡 Not quite, but great effort!',
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizQuestion'] });
      queryClient.invalidateQueries({ queryKey: ['quizStatistics'] });
    },
  });
}

export function useGetQuizStatistics() {
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['quizStatistics', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      
      const principal = identity.getPrincipal().toString();
      const progress = loadQuizProgress(principal) || initializeQuizProgress();
      
      const totalQuestions = mockQuizQuestions.length;
      const progressPercentage = totalQuestions > 0 
        ? (progress.questionsCompleted / totalQuestions) * 100 
        : 0;
      
      return {
        totalQuestions,
        questionsCompleted: progress.questionsCompleted,
        correctAnswers: progress.correctAnswers,
        incorrectAnswers: progress.incorrectAnswers,
        currentDifficulty: QuizDifficulty.easy,
        progressPercentage,
      };
    },
    enabled: !!identity,
  });
}
