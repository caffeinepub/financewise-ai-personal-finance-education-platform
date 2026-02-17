import type { SavingsGoal } from '../../types/backend-types';

export interface SimulationScenario {
  label: string;
  months: number;
  requiredMonthlySaving: number;
  requiredDailySaving: number;
  feasibilityLabel: string;
  isFeasible: boolean;
}

/**
 * Generates three simulation scenarios for a goal
 * A: Current timeline
 * B: Longer timeline (+50%)
 * C: Shorter timeline (-33%)
 */
export function generateSimulationScenarios(
  goal: SavingsGoal,
  monthlyIncome: number
): SimulationScenario[] {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  
  let currentMonths: number;
  if (goal.targetDate) {
    const now = Date.now();
    currentMonths = Math.max(1, Math.ceil((goal.targetDate - now) / (1000 * 60 * 60 * 24 * 30)));
  } else if (goal.targetMonths) {
    const elapsed = Date.now() - goal.createdAt;
    const elapsedMonths = elapsed / (1000 * 60 * 60 * 24 * 30);
    currentMonths = Math.max(1, Math.ceil(goal.targetMonths - elapsedMonths));
  } else {
    currentMonths = 6;
  }

  const longerMonths = Math.ceil(currentMonths * 1.5);
  const shorterMonths = Math.max(1, Math.ceil(currentMonths * 0.67));

  const scenarios: SimulationScenario[] = [
    createScenario('A', currentMonths, remaining, monthlyIncome),
    createScenario('B', longerMonths, remaining, monthlyIncome),
    createScenario('C', shorterMonths, remaining, monthlyIncome),
  ];

  return scenarios;
}

function createScenario(
  label: string,
  months: number,
  remaining: number,
  monthlyIncome: number
): SimulationScenario {
  const requiredMonthlySaving = remaining / months;
  const requiredDailySaving = requiredMonthlySaving / 30;
  const isFeasible = monthlyIncome > 0 ? requiredMonthlySaving <= monthlyIncome * 0.6 : true;
  const feasibilityLabel = isFeasible ? 'Achievable' : 'Difficult';

  return {
    label,
    months,
    requiredMonthlySaving,
    requiredDailySaving,
    feasibilityLabel,
    isFeasible,
  };
}
