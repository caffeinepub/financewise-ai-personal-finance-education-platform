import type { SavingsGoal } from '../../types/backend-types';

export interface GoalPlanMetrics {
  remaining: number;
  progressPercent: number;
  requiredMonthlySaving: number;
  requiredDailySaving: number;
  isFeasible: boolean;
  feasibilityLabel: string;
  warningMessage: string | null;
}

/**
 * Computes months remaining from goal timeline
 * Returns minimum of 1 to avoid division by zero
 */
export function computeMonthsRemaining(goal: SavingsGoal): number {
  if (goal.targetDate) {
    const now = Date.now();
    const monthsRemaining = Math.max(
      1,
      Math.ceil((goal.targetDate - now) / (1000 * 60 * 60 * 24 * 30))
    );
    return monthsRemaining;
  }
  if (goal.targetMonths) {
    const elapsed = Date.now() - goal.createdAt;
    const elapsedMonths = elapsed / (1000 * 60 * 60 * 24 * 30);
    const remaining = Math.max(1, Math.ceil(goal.targetMonths - elapsedMonths));
    return remaining;
  }
  return 6; // Default fallback
}

/**
 * Computes days remaining from goal timeline
 */
export function computeDaysRemaining(goal: SavingsGoal): number | null {
  if (goal.targetDate) {
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((goal.targetDate - now) / (1000 * 60 * 60 * 24)));
    return daysRemaining;
  }
  if (goal.targetMonths) {
    const elapsed = Date.now() - goal.createdAt;
    const elapsedMonths = elapsed / (1000 * 60 * 60 * 24 * 30);
    const remainingMonths = Math.max(0, goal.targetMonths - elapsedMonths);
    return Math.ceil(remainingMonths * 30);
  }
  return null;
}

/**
 * Computes goal planning metrics
 */
export function computeGoalPlanMetrics(
  goal: SavingsGoal,
  monthlyIncome: number
): GoalPlanMetrics {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const progressPercent = goal.targetAmount > 0 
    ? (goal.currentAmount / goal.targetAmount) * 100 
    : 0;

  const monthsRemaining = computeMonthsRemaining(goal);
  const requiredMonthlySaving = remaining / monthsRemaining;
  const requiredDailySaving = requiredMonthlySaving / 30;

  const isFeasible = monthlyIncome > 0 ? requiredMonthlySaving <= monthlyIncome * 0.6 : true;
  const feasibilityLabel = isFeasible ? 'Achievable' : 'Unrealistic';

  let warningMessage: string | null = null;
  if (!isFeasible && monthlyIncome > 0) {
    const suggestedMonths = Math.ceil(remaining / (monthlyIncome * 0.6));
    warningMessage = `⚠️ This goal may be difficult based on your current income. Consider extending timeline to ${suggestedMonths} months.`;
  }

  return {
    remaining,
    progressPercent,
    requiredMonthlySaving,
    requiredDailySaving,
    isFeasible,
    feasibilityLabel,
    warningMessage,
  };
}
