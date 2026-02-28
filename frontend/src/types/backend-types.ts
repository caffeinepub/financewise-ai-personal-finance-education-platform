// Local type definitions for backend data structures
// These types mirror the backend Motoko types but are defined locally since they're not exported

import type { Principal } from '@icp-sdk/core/principal';

export interface UserPreferences {
  themeMode: string;
  notificationsEnabled: boolean;
  analyticsVisible: boolean;
  currency: Currency;
  updatedAt: number;
}

export enum Currency {
  usd = 'usd',
  inr = 'inr',
  eur = 'eur',
}

export interface TransactionData {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: number;
  paymentType: string;
  user: Principal;
  createdAt: number;
  transactionType: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  user: Principal;
  createdAt: number;
  targetDate?: number;
  targetMonths?: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: number;
}

export interface AIPrediction {
  user: Principal;
  futureSavings: number;
  balancePrediction: number;
  riskLevel: string;
  savingsConsistency: number;
  spendingGrowthRate: number;
  expenseCategoryAnalysis: Array<[string, number, number]>;
  remainingGoalAmount: number;
  disclaimer: string;
  confidenceScore: number;
  lastUpdated: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publicationDate: number;
  slug: string;
  seoMeta: string;
}

export interface BlogPreview {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  publicationDate: number;
  slug: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  realLifeTip: string;
  topic: QuizTopic;
  difficulty: QuizDifficulty;
}

export enum QuizTopic {
  budgeting = 'budgeting',
  saving = 'saving',
  emergencyFunds = 'emergencyFunds',
  salaryManagement = 'salaryManagement',
  debts = 'debts',
  loans = 'loans',
  credit = 'credit',
  spending = 'spending',
  mistakes = 'mistakes',
  investing = 'investing',
  digitalPayments = 'digitalPayments',
}

export enum QuizDifficulty {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
}

export interface QuizProgress {
  user: Principal;
  questionsCompleted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  currentDifficulty: QuizDifficulty;
  askedQuestions: string[];
  lastQuestionAt: number;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export enum ChatRole {
  user = 'user',
  assistant = 'assistant',
}
