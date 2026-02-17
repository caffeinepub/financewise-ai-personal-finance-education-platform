import type { TransactionData } from '../../types/backend-types';

export interface MonthlyAggregates {
  income: number;
  expenses: number;
  availableSavings: number;
  categoryTotals: Array<{ category: string; total: number }>;
}

/**
 * Computes current-month income, expenses, and available savings from transactions
 */
export function computeCurrentMonthAggregates(transactions: TransactionData[]): MonthlyAggregates {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let income = 0;
  let expenses = 0;
  const categoryMap = new Map<string, number>();

  transactions.forEach((txn) => {
    const txnDate = new Date(txn.date);
    if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
      if (txn.transactionType === 'income') {
        income += txn.amount;
      } else if (txn.transactionType === 'expense') {
        expenses += txn.amount;
        const current = categoryMap.get(txn.category) || 0;
        categoryMap.set(txn.category, current + txn.amount);
      }
    }
  });

  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return {
    income,
    expenses,
    availableSavings: income - expenses,
    categoryTotals,
  };
}

/**
 * Gets top N expense categories for the current month
 */
export function getTopExpenseCategories(
  transactions: TransactionData[],
  limit: number = 3
): Array<{ category: string; total: number }> {
  const aggregates = computeCurrentMonthAggregates(transactions);
  return aggregates.categoryTotals.slice(0, limit);
}
