import type { TransactionData } from '../../backend';

export interface CategoryAggregate {
  category: string;
  totalAmount: number;
}

export interface MonthlyAggregates {
  income: number;
  expenses: number;
  availableSavings: number;
  categoryTotals: CategoryAggregate[];
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
    // date is bigint (nanoseconds) from backend
    const txnDate = new Date(Number(txn.date) / 1_000_000);
    if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
      if (txn.transactionType === 'income') {
        income += Number(txn.amount);
      } else if (txn.transactionType === 'expense') {
        expenses += Number(txn.amount);
        const current = categoryMap.get(txn.category) || 0;
        categoryMap.set(txn.category, current + Number(txn.amount));
      }
    }
  });

  const categoryTotals: CategoryAggregate[] = Array.from(categoryMap.entries())
    .map(([category, totalAmount]) => ({ category, totalAmount }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    income,
    expenses,
    availableSavings: income - expenses,
    categoryTotals,
  };
}

/**
 * Gets current month total expenses
 */
export function getCurrentMonthExpenses(transactions: TransactionData[]): number {
  return computeCurrentMonthAggregates(transactions).expenses;
}

/**
 * Gets current month total income
 */
export function getCurrentMonthIncome(transactions: TransactionData[]): number {
  return computeCurrentMonthAggregates(transactions).income;
}

/**
 * Gets available savings for current month
 */
export function getAvailableSavings(transactions: TransactionData[]): number {
  return computeCurrentMonthAggregates(transactions).availableSavings;
}

/**
 * Gets top N expense categories for the current month
 */
export function getTopExpenseCategories(
  transactions: TransactionData[],
  limit: number = 3
): CategoryAggregate[] {
  const aggregates = computeCurrentMonthAggregates(transactions);
  return aggregates.categoryTotals.slice(0, limit);
}
