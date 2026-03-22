import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AIPrediction,
  BudgetPlan,
  ChatMessage,
  ContactSubmission,
  EmergencyFundData,
  NetWorthData,
  QuizAnswer,
  SavingsGoal,
  SpendingLimit,
  TransactionData,
  UserPreferences,
  UserProfile,
} from "../backend";
import {
  type AssistantContext,
  type AssistantResponse,
  generateResponse,
} from "../lib/deterministicAssistant";
import { useActor } from "./useActor";

// ─── Profile ────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Profile saved successfully");
    },
    onError: () => {
      toast.error("Failed to save profile");
    },
  });
}

// ─── Preferences ────────────────────────────────────────────────────────────

export function useGetUserPreferences() {
  const { actor, isFetching } = useActor();

  return useQuery<UserPreferences | null>({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserPreferences();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Alias kept for backward compatibility */
export const useGetCallerUserPreferences = useGetUserPreferences;

export function useSaveUserPreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveUserPreferences(preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
      toast.success("Preferences saved");
    },
    onError: () => {
      toast.error("Failed to save preferences");
    },
  });
}

// ─── Transactions ────────────────────────────────────────────────────────────

export function useGetUserTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<TransactionData[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: TransactionData) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction added");
    },
    onError: () => {
      toast.error("Failed to add transaction");
    },
  });
}

export function useUpdateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: { id: string; updates: Partial<TransactionData> }) => {
      if (!actor) throw new Error("Actor not available");
      const existing = await actor.getTransactions();
      const transaction = existing.find((t) => t.id === id);
      if (!transaction) throw new Error("Transaction not found");
      await actor.deleteTransaction(id);
      return actor.addTransaction({ ...transaction, ...updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated");
    },
    onError: () => {
      toast.error("Failed to update transaction");
    },
  });
}

export function useDeleteTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteTransaction(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted");
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });
}

// ─── Savings Goals ───────────────────────────────────────────────────────────

export function useGetSavingsGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<SavingsGoal[]>({
    queryKey: ["savingsGoals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSavingsGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Alias kept for backward compatibility */
export const useGetUserSavingsGoals = useGetSavingsGoals;

export function useAddSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: SavingsGoal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addSavingsGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Goal added");
    },
    onError: () => {
      toast.error("Failed to add goal");
    },
  });
}

export function useUpdateSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goalId,
      updatedGoal,
    }: { goalId: string; updatedGoal: SavingsGoal }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSavingsGoal(goalId, updatedGoal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Goal updated");
    },
    onError: () => {
      toast.error("Failed to update goal");
    },
  });
}

export function useDeleteSavingsGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSavingsGoal(goalId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Goal deleted");
    },
    onError: () => {
      toast.error("Failed to delete goal");
    },
  });
}

// ─── Derived: Balance ─────────────────────────────────────────────────────────

export function useGetBalance() {
  const { data: transactions } = useGetUserTransactions();

  const income = (transactions ?? [])
    .filter((t) => t.transactionType === "income")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const expenses = (transactions ?? [])
    .filter((t) => t.transactionType === "expense")
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return useQuery<number>({
    queryKey: ["balance", income, expenses],
    queryFn: () => income - expenses,
    enabled: transactions !== undefined,
  });
}

// ─── Derived: Category Data ───────────────────────────────────────────────────

export function useGetCategoryData() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ["categoryData", transactions?.length],
    queryFn: () => {
      if (!transactions) return [];
      const map = new Map<string, number>();
      for (const t of transactions) {
        if (t.transactionType === "expense") {
          map.set(
            t.category,
            (map.get(t.category) || 0) + (Number(t.amount) || 0),
          );
        }
      }
      return Array.from(map.entries()).map(([category, totalAmount]) => ({
        category,
        totalAmount,
        color: "#8884d8",
      }));
    },
    enabled: !!transactions,
  });
}

// ─── Derived: Monthly Comparison ─────────────────────────────────────────────

export function useGetMonthlyComparison() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ["monthlyComparison", transactions?.length],
    queryFn: () => {
      if (!transactions) return [];
      const map = new Map<string, { expenses: number; income: number }>();
      for (const t of transactions) {
        const date = new Date(Number(t.date) / 1_000_000);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const cur = map.get(key) || { expenses: 0, income: 0 };
        const amount = Number(t.amount) || 0;
        if (t.transactionType === "income") cur.income += amount;
        else cur.expenses += amount;
        map.set(key, cur);
      }
      return Array.from(map.entries()).map(([month, data]) => ({
        month,
        expenses: data.expenses,
        income: data.income,
        savings: data.income - data.expenses,
      }));
    },
    enabled: !!transactions,
  });
}

// ─── Derived: Financial Trends ────────────────────────────────────────────────

export function useGetFinancialTrends() {
  const { data: transactions } = useGetUserTransactions();

  return useQuery({
    queryKey: ["financialTrends", transactions?.length],
    queryFn: () => {
      if (!transactions) return [];
      let balance = 0;
      return transactions.map((t) => {
        const amount = Number(t.amount) || 0;
        balance += t.transactionType === "income" ? amount : -amount;
        return {
          date: Number(t.date),
          balance,
          expenses: t.transactionType === "expense" ? amount : 0,
          income: t.transactionType === "income" ? amount : 0,
        };
      });
    },
    enabled: !!transactions,
  });
}

// ─── AI Prediction ───────────────────────────────────────────────────────────

export function useGetAIPrediction() {
  const { actor, isFetching } = useActor();

  return useQuery<AIPrediction | null>({
    queryKey: ["aiPrediction"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAIPrediction();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveAIPrediction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prediction: AIPrediction) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveAIPrediction(prediction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrediction"] });
    },
    onError: () => {
      toast.error("Failed to save AI prediction");
    },
  });
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitContactForm(submission);
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export function useCreateChatSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createChatSession(sessionId);
    },
  });
}

export function useAddChatMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: { sessionId: string; message: ChatMessage }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addChatMessage(sessionId, message);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chatSession", variables.sessionId],
      });
    },
  });
}

export function useGetChatSession(sessionId: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["chatSession", sessionId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getChatSession(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export function useGetQuizStatistics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["quizStatistics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getQuizStatistics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitQuizAnswer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (answer: QuizAnswer) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitQuizAnswer(answer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizStatistics"] });
    },
  });
}

// ─── Budget Plan ─────────────────────────────────────────────────────────────

export function useGetBudgetPlan() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["budgetPlan"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBudgetPlan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveBudgetPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: BudgetPlan) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveBudgetPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetPlan"] });
      toast.success("Budget plan saved");
    },
    onError: () => {
      toast.error("Failed to save budget plan");
    },
  });
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

const mockBlogPosts = [
  {
    id: "1",
    title:
      "Master Your Money: The Complete Guide to Personal Finance Fundamentals",
    slug: "personal-finance-fundamentals-guide",
    excerpt: "Learn the essential building blocks of personal finance.",
    featuredImage: "/assets/generated/blog-personal-finance.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 5,
    seoMeta: "",
  },
  {
    id: "2",
    title: "Smart Saving Strategies: How to Build Wealth on Any Income",
    slug: "smart-saving-strategies-build-wealth",
    excerpt: "Discover proven saving strategies.",
    featuredImage: "/assets/generated/blog-saving-investing.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 10,
    seoMeta: "",
  },
  {
    id: "3",
    title: "Budgeting Methods That Actually Work: 50/30/20, Zero-Based & More",
    slug: "budgeting-methods-that-work",
    excerpt: "Explore practical budgeting methods.",
    featuredImage: "/assets/generated/blog-budgeting-system.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 15,
    seoMeta: "",
  },
  {
    id: "4",
    title: "Investing for Beginners: Your First Steps into the Stock Market",
    slug: "investing-for-beginners-first-steps",
    excerpt: "Demystify investing with this beginner-friendly guide.",
    featuredImage: "/assets/generated/blog-investment-basics.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 20,
    seoMeta: "",
  },
  {
    id: "5",
    title: "Stock Market Basics: Understanding How Markets Work",
    slug: "stock-market-basics-understanding-markets",
    excerpt: "Get a clear understanding of how stock markets function.",
    featuredImage: "/assets/generated/blog-stock-market-basics.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 25,
    seoMeta: "",
  },
  {
    id: "6",
    title: "Mutual Funds Explained: A Complete Guide for New Investors",
    slug: "mutual-funds-complete-guide",
    excerpt: "Understand mutual funds inside and out.",
    featuredImage:
      "/assets/generated/blog-mutual-funds-explained.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 30,
    seoMeta: "",
  },
  {
    id: "7",
    title: "SIP Investment Strategy: Build Wealth Through Systematic Investing",
    slug: "sip-investment-strategy-systematic-investing",
    excerpt: "Learn how SIPs help you build wealth consistently.",
    featuredImage:
      "/assets/generated/blog-sip-investment-guide.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 35,
    seoMeta: "",
  },
  {
    id: "8",
    title: "Emergency Fund Essentials: Why You Need One and How to Build It",
    slug: "emergency-fund-essentials-how-to-build",
    excerpt: "Discover why an emergency fund is your financial safety net.",
    featuredImage: "/assets/generated/blog-emergency-fund.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 40,
    seoMeta: "",
  },
  {
    id: "9",
    title: "Debt Management: Proven Strategies to Become Debt-Free Faster",
    slug: "debt-management-strategies-debt-free",
    excerpt: "Take control of your debt with proven strategies.",
    featuredImage: "/assets/generated/blog-debt-management.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 45,
    seoMeta: "",
  },
  {
    id: "10",
    title: "Financial Goal Setting: Turn Dreams into Achievable Milestones",
    slug: "financial-goal-setting-achievable-milestones",
    excerpt: "Transform vague financial wishes into concrete goals.",
    featuredImage: "/assets/generated/blog-financial-goals.dim_800x600.jpg",
    publicationDate: Date.now() - 86400000 * 50,
    seoMeta: "",
  },
];

export function useGetAllBlogPosts() {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => mockBlogPosts,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blogPost", slug],
    queryFn: async () => mockBlogPosts.find((p) => p.slug === slug) || null,
    enabled: !!slug,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ─── AI Chat (deterministic) ──────────────────────────────────────────────────

export function useProcessChatMessage() {
  const { data: transactions } = useGetUserTransactions();
  const { data: goals } = useGetSavingsGoals();
  const { data: balanceData } = useGetBalance();

  return useMutation({
    mutationFn: async (userMessage: string): Promise<AssistantResponse> => {
      const txList = (transactions ?? []).map((t) => ({
        amount: Number(t.amount),
        category: t.category,
        transactionType: t.transactionType,
      }));
      const totalIncome = txList
        .filter((t) => t.transactionType === "income")
        .reduce((s, t) => s + t.amount, 0);
      const totalExpenses = txList
        .filter((t) => t.transactionType === "expense")
        .reduce((s, t) => s + t.amount, 0);

      const context: AssistantContext = {
        balance: balanceData ?? 0,
        totalIncome,
        totalExpenses,
        recentTransactions: txList.slice(-10),
        totalTransactions: txList.length,
        hasData: txList.length > 0,
        savingsGoals: (goals ?? []).map((g) => ({
          name: g.name,
          targetAmount: Number(g.targetAmount),
          currentAmount: Number(g.currentAmount),
        })),
      };
      return generateResponse(userMessage, context);
    },
  });
}

// ─── Net Worth ────────────────────────────────────────────────────────────────

export function useGetNetWorthData() {
  const { actor, isFetching } = useActor();

  return useQuery<NetWorthData | null>({
    queryKey: ["netWorthData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNetWorthData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveNetWorthData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NetWorthData) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveNetWorthData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["netWorthData"] });
      toast.success("Net worth data saved");
    },
    onError: () => {
      toast.error("Failed to save net worth data");
    },
  });
}

// ─── Emergency Fund ───────────────────────────────────────────────────────────

export function useGetEmergencyFundData() {
  const { actor, isFetching } = useActor();

  return useQuery<EmergencyFundData | null>({
    queryKey: ["emergencyFundData"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEmergencyFundData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveEmergencyFundData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmergencyFundData) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveEmergencyFundData(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyFundData"] });
      toast.success("Emergency fund data saved");
    },
    onError: () => {
      toast.error("Failed to save emergency fund data");
    },
  });
}

// ─── Spending Limits ──────────────────────────────────────────────────────────

export function useGetSpendingLimits() {
  const { actor, isFetching } = useActor();

  return useQuery<SpendingLimit[]>({
    queryKey: ["spendingLimits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSpendingLimits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveSpendingLimits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (limits: SpendingLimit[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveSpendingLimits(limits);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spendingLimits"] });
      toast.success("Spending limits saved");
    },
    onError: () => {
      toast.error("Failed to save spending limits");
    },
  });
}
