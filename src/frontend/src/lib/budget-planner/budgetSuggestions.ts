import {
  calculateBudgetPercentages,
  calculateBudgetTotals,
} from "./budgetCalculations";
import {
  BUDGET_MODE_ALLOCATIONS,
  type BudgetModeKey,
  type SmartBudgetCategory,
} from "./budgetModes";

export type SuggestionType = "warning" | "tip" | "opportunity";

export interface BudgetSuggestion {
  id: string;
  type: SuggestionType;
  message: string;
  category?: string;
}

export function generateBudgetSuggestions(
  categories: SmartBudgetCategory[],
  monthlyIncome: number,
  mode: BudgetModeKey,
): BudgetSuggestion[] {
  const suggestions: BudgetSuggestion[] = [];
  const totals = calculateBudgetTotals(categories);
  const percentages = calculateBudgetPercentages(totals, monthlyIncome);
  const target = BUDGET_MODE_ALLOCATIONS[mode];

  // Check if savings is below target
  if (percentages.savingsPercent < target.savings) {
    const gap = target.savings - percentages.savingsPercent;
    const gapAmount = Math.round((gap / 100) * monthlyIncome);
    suggestions.push({
      id: "sav-1",
      type: "warning",
      message: `Your savings (${percentages.savingsPercent}%) are below the ${target.savings}% target for ${mode} mode. Increase savings by ~${gapAmount} to reach your goal.`,
      category: "Savings",
    });
  }

  // Check if wants exceed target
  if (percentages.wantsPercent > target.wants + 5) {
    const excess = percentages.wantsPercent - target.wants;
    const excessAmount = Math.round((excess / 100) * monthlyIncome);
    suggestions.push({
      id: "want-1",
      type: "warning",
      message: `Your discretionary spending (${percentages.wantsPercent}%) exceeds the ${target.wants}% target. Reduce wants by ~${excessAmount} to stay on track.`,
      category: "Wants",
    });
  }

  // Check individual categories for high spending
  for (const cat of categories) {
    if (cat.allocationType === "Needs" && totals.needsTotal > 0) {
      const share = (cat.amount / totals.needsTotal) * 100;
      if (share > 45) {
        suggestions.push({
          id: `cat-high-${cat.id}`,
          type: "warning",
          message: `"${cat.name}" takes up ${Math.round(share)}% of your Needs budget. Consider if this can be reduced.`,
          category: cat.name,
        });
      }
    }
    if (cat.allocationType === "Wants" && totals.wantsTotal > 0) {
      const share = (cat.amount / totals.wantsTotal) * 100;
      if (share > 50) {
        suggestions.push({
          id: `cat-want-${cat.id}`,
          type: "tip",
          message: `"${cat.name}" dominates your Wants budget at ${Math.round(share)}%. Spreading across more categories improves financial flexibility.`,
          category: cat.name,
        });
      }
    }
  }

  // Savings opportunity
  if (percentages.savingsPercent >= target.savings) {
    suggestions.push({
      id: "sav-good",
      type: "opportunity",
      message: `Great job! Your savings rate (${percentages.savingsPercent}%) meets the ${target.savings}% target. Consider investing the surplus for long-term growth.`,
      category: "Savings",
    });
  }

  // Emergency fund check
  const emergencyCat = categories.find((c) =>
    c.name.toLowerCase().includes("emergency"),
  );
  if (!emergencyCat || emergencyCat.amount === 0) {
    suggestions.push({
      id: "emergency-1",
      type: "tip",
      message:
        "No emergency fund allocation found. Aim to save 3–6 months of expenses for financial security.",
      category: "Emergency Fund",
    });
  }

  // Spending prediction tip
  const predictedExpenses = totals.needsTotal + totals.wantsTotal;
  const predictedSavings = totals.savingsTotal;
  suggestions.push({
    id: "predict-1",
    type: "tip",
    message: `Based on your budget, you are expected to spend ~${Math.round(predictedExpenses)} and save ~${Math.round(predictedSavings)} next month.`,
  });

  // Ensure at least 3 suggestions
  if (suggestions.length < 3) {
    suggestions.push({
      id: "general-1",
      type: "opportunity",
      message:
        "Review your budget monthly and adjust categories as your income or expenses change.",
    });
  }

  return suggestions.slice(0, 6);
}
