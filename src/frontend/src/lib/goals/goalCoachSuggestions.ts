import type { TransactionData } from '../../types/backend-types';
import { getTopExpenseCategories } from '../transactions/monthlyAggregates';

export interface ExpenseOptimizationSuggestion {
  category: string;
  currentSpend: number;
  reductionPercent: number;
  estimatedSavings: number;
  suggestion: string;
}

export interface IncomeBoostIdea {
  title: string;
  description: string;
}

/**
 * Generates expense optimization suggestions based on top expense categories
 */
export function generateExpenseOptimizationSuggestions(
  transactions: TransactionData[]
): ExpenseOptimizationSuggestion[] {
  const topCategories = getTopExpenseCategories(transactions, 3);
  
  const suggestions: ExpenseOptimizationSuggestion[] = [];

  topCategories.forEach((cat, index) => {
    const reductionPercent = index === 0 ? 30 : index === 1 ? 20 : 15;
    const estimatedSavings = cat.total * (reductionPercent / 100);
    
    suggestions.push({
      category: cat.category,
      currentSpend: cat.total,
      reductionPercent,
      estimatedSavings,
      suggestion: `Reduce ${cat.category} spending by ${reductionPercent}% to save approximately ${estimatedSavings.toFixed(0)} per month`,
    });
  });

  return suggestions;
}

/**
 * Returns static income boost ideas
 */
export function getIncomeBoostIdeas(): IncomeBoostIdea[] {
  return [
    {
      title: 'Freelancing',
      description: 'Offer your skills on platforms like Upwork, Fiverr, or Freelancer',
    },
    {
      title: 'Selling Unused Items',
      description: 'Declutter and sell items you no longer need on marketplaces',
    },
    {
      title: 'Weekend Part-Time Work',
      description: 'Take on weekend gigs or part-time roles to supplement income',
    },
    {
      title: 'Skill Monetization',
      description: 'Teach, consult, or create content around your expertise',
    },
  ];
}
