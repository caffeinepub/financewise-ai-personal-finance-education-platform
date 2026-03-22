import type { SmartBudgetCategory } from "./budgetModes";
import { BUDGET_MODE_ALLOCATIONS, type BudgetModeKey } from "./budgetModes";

export interface BudgetTotals {
  needsTotal: number;
  wantsTotal: number;
  savingsTotal: number;
  grandTotal: number;
}

export function calculateBudgetTotals(
  categories: SmartBudgetCategory[],
): BudgetTotals {
  let needsTotal = 0;
  let wantsTotal = 0;
  let savingsTotal = 0;

  for (const cat of categories) {
    if (cat.allocationType === "Needs") needsTotal += cat.amount;
    else if (cat.allocationType === "Wants") wantsTotal += cat.amount;
    else savingsTotal += cat.amount;
  }

  return {
    needsTotal,
    wantsTotal,
    savingsTotal,
    grandTotal: needsTotal + wantsTotal + savingsTotal,
  };
}

export interface BudgetPercentages {
  needsPercent: number;
  wantsPercent: number;
  savingsPercent: number;
}

export function calculateBudgetPercentages(
  totals: BudgetTotals,
  monthlyIncome: number,
): BudgetPercentages {
  if (monthlyIncome <= 0)
    return { needsPercent: 0, wantsPercent: 0, savingsPercent: 0 };
  return {
    needsPercent: Math.round((totals.needsTotal / monthlyIncome) * 100),
    wantsPercent: Math.round((totals.wantsTotal / monthlyIncome) * 100),
    savingsPercent: Math.round((totals.savingsTotal / monthlyIncome) * 100),
  };
}

export interface AllocationVariance {
  needsVariance: number;
  wantsVariance: number;
  savingsVariance: number;
}

export function compareToTargetAllocations(
  actual: BudgetPercentages,
  mode: BudgetModeKey,
): AllocationVariance {
  const target = BUDGET_MODE_ALLOCATIONS[mode];
  return {
    needsVariance: actual.needsPercent - target.needs,
    wantsVariance: actual.wantsPercent - target.wants,
    savingsVariance: actual.savingsPercent - target.savings,
  };
}
