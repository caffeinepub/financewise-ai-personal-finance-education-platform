export function calculateTargetAmount(monthlyExpenses: number): number {
  return monthlyExpenses * 6;
}

export function calculateProgress(saved: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, (saved / target) * 100);
}

export type EmergencyLevel = 'Safe' | 'Moderate' | 'Low';

export function calculateEmergencyLevel(
  saved: number,
  monthlyExpenses: number
): EmergencyLevel {
  if (monthlyExpenses <= 0) return 'Low';
  const monthsCovered = saved / monthlyExpenses;
  if (monthsCovered >= 6) return 'Safe';
  if (monthsCovered >= 3) return 'Moderate';
  return 'Low';
}

export function calculateMonthsCovered(saved: number, monthlyExpenses: number): number {
  if (monthlyExpenses <= 0) return 0;
  return saved / monthlyExpenses;
}

export interface SavingPlan {
  monthlyRequired: number;
  monthsToGoal: number;
}

export function calculateSavingPlan(
  remaining: number,
  monthlySavingsCapacity: number
): SavingPlan {
  if (monthlySavingsCapacity <= 0) {
    return { monthlyRequired: remaining / 12, monthsToGoal: 999 };
  }
  const monthlyRequired = Math.max(remaining / 24, monthlySavingsCapacity * 0.2);
  const monthsToGoal = remaining <= 0 ? 0 : Math.ceil(remaining / monthlyRequired);
  return { monthlyRequired, monthsToGoal };
}

export interface OptimizedPlan {
  strategy: string;
  monthlyRequired: number;
  monthsToGoal: number;
}

export function generateOptimizedPlan(
  remaining: number,
  monthlySavingsCapacity: number
): OptimizedPlan {
  const boostedMonthly = Math.max(
    monthlySavingsCapacity * 0.3,
    remaining / 12
  );
  const monthsToGoal = remaining <= 0 ? 0 : Math.ceil(remaining / boostedMonthly);
  return {
    strategy: 'Increase monthly savings by 30% and automate transfers on payday',
    monthlyRequired: boostedMonthly,
    monthsToGoal,
  };
}
