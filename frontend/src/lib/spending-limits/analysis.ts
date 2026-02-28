import type { TransactionData, SpendingLimit } from '../../backend';

export function calculateCategorySpent(
  transactions: TransactionData[],
  category: string,
  currentMonth: Date
): number {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  return transactions
    .filter((t) => {
      if (t.transactionType !== 'expense') return false;
      const tDate = new Date(Number(t.date));
      return (
        tDate.getFullYear() === year &&
        tDate.getMonth() === month &&
        t.category.toLowerCase() === category.toLowerCase()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
}

export type LimitStatus = 'safe' | 'warning' | 'alert';

export interface LimitUsage {
  percentage: number;
  status: LimitStatus;
}

export function calculateLimitUsage(spent: number, limit: number): LimitUsage {
  if (limit <= 0) return { percentage: 0, status: 'safe' };
  const percentage = (spent / limit) * 100;
  let status: LimitStatus = 'safe';
  if (percentage >= 100) status = 'alert';
  else if (percentage >= 80) status = 'warning';
  return { percentage, status };
}

export function generateSpendingSuggestions(
  limits: SpendingLimit[],
  spent: Record<string, number>
): string[] {
  const suggestions: string[] = [];

  const overBudget = limits.filter((l) => {
    const s = spent[l.category] ?? 0;
    return l.limitAmount > 0 && s >= l.limitAmount;
  });

  const nearLimit = limits.filter((l) => {
    const s = spent[l.category] ?? 0;
    const pct = l.limitAmount > 0 ? (s / l.limitAmount) * 100 : 0;
    return pct >= 80 && pct < 100;
  });

  overBudget.forEach((l) => {
    const excess = Math.round((spent[l.category] ?? 0) - l.limitAmount);
    suggestions.push(
      `${capitalize(String(l.category))} is ${excess} over budget — skip non-essentials this week to get back on track`
    );
  });

  nearLimit.forEach((l) => {
    const remaining = Math.round(l.limitAmount - (spent[l.category] ?? 0));
    suggestions.push(
      `${capitalize(String(l.category))} has only ${remaining} remaining — be mindful of upcoming purchases`
    );
  });

  if (suggestions.length < 3) {
    suggestions.push(
      'Review subscriptions and recurring charges — cancelling unused services can free up budget across categories'
    );
  }

  if (suggestions.length < 3) {
    suggestions.push(
      'Plan meals weekly to reduce food spending and avoid impulse purchases'
    );
  }

  if (suggestions.length < 3) {
    suggestions.push(
      'Use the 24-hour rule before making non-essential purchases to reduce impulse spending'
    );
  }

  return suggestions.slice(0, 5);
}

export function generateContextualMessage(
  limits: SpendingLimit[],
  spent: Record<string, number>
): string {
  if (limits.length === 0) {
    return 'Set spending limits for your categories to start tracking your budget control.';
  }

  const total = limits.length;
  const overCount = limits.filter((l) => {
    const s = spent[l.category] ?? 0;
    return l.limitAmount > 0 && s >= l.limitAmount;
  }).length;

  const withinCount = total - overCount;

  if (overCount === 0) {
    return `Excellent! You're within limits in all ${total} categories. Keep up the great financial discipline!`;
  } else if (overCount === 1) {
    const overCat = limits.find((l) => {
      const s = spent[l.category] ?? 0;
      return l.limitAmount > 0 && s >= l.limitAmount;
    });
    return `You're within limits in ${withinCount}/${total} categories. Focus on reducing ${capitalize(String(overCat?.category ?? ''))} spending this month.`;
  } else {
    return `You're within limits in ${withinCount}/${total} categories. ${overCount} categories need attention — review your spending priorities.`;
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
