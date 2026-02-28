export interface TopCategory {
  category: string;
  amount: number;
}

export function generateEmergencyFundSuggestions(
  saved: number,
  target: number,
  monthlyExpenses: number,
  topCategories: TopCategory[]
): string[] {
  const suggestions: string[] = [];
  const progress = target > 0 ? (saved / target) * 100 : 0;
  const monthsCovered = monthlyExpenses > 0 ? saved / monthlyExpenses : 0;

  if (topCategories.length > 0) {
    const top = topCategories[0];
    const potentialSaving = Math.round(top.amount * 0.15);
    if (potentialSaving > 0) {
      suggestions.push(
        `Reduce ${top.category} spending by 15% to save an extra ${potentialSaving} per month toward your emergency fund`
      );
    }
  }

  if (monthsCovered < 3) {
    suggestions.push(
      'Set up an automatic transfer to your emergency fund on every payday — even small amounts add up quickly'
    );
    suggestions.push(
      'Consider a "no-spend" weekend each month to redirect discretionary spending to your emergency fund'
    );
  } else if (monthsCovered < 6) {
    suggestions.push(
      `You're ${Math.round(progress)}% there — stay consistent and you'll reach the Safe level soon`
    );
    suggestions.push(
      'Round up daily purchases and transfer the difference to your emergency fund automatically'
    );
  } else {
    suggestions.push(
      'Your emergency fund is strong! Consider investing surplus savings in low-risk instruments'
    );
    suggestions.push(
      'Review your emergency fund annually and adjust the target as your expenses change'
    );
  }

  if (topCategories.length > 1) {
    const second = topCategories[1];
    suggestions.push(
      `Audit your ${second.category} expenses — small reductions here can accelerate your emergency fund growth`
    );
  } else {
    suggestions.push(
      'Save ₹200–₹500 daily by cutting one unnecessary expense and transferring it directly to savings'
    );
  }

  return suggestions.slice(0, 5);
}
