import type { BudgetInputs, BudgetPlan } from '../../types/budget-planner';

export function generateRecommendations(
  inputs: BudgetInputs,
  plan: BudgetPlan
): string[] {
  const recommendations: string[] = [];
  
  // Recommendation 1: Savings optimization
  const potentialSavings = plan.allocation.wants.amount * 0.2;
  if (potentialSavings > 0) {
    recommendations.push(
      `You can save an additional ${Math.round(potentialSavings)} per month by reducing discretionary spending by just 20%. This could add up to ${Math.round(potentialSavings * 12)} annually!`
    );
  }
  
  // Recommendation 2: Emergency fund
  const emergencyFundTarget = plan.summary.totalExpenses * 6;
  const emergencyFundGap = emergencyFundTarget - (inputs.emergencyFund || 0);
  if (emergencyFundGap > 0) {
    const monthsToTarget = Math.ceil(emergencyFundGap / plan.summary.suggestedSavings);
    recommendations.push(
      `Your emergency fund target is ${Math.round(emergencyFundTarget)}. At your current savings rate, you can reach this goal in approximately ${monthsToTarget} months.`
    );
  } else {
    recommendations.push(
      'Great job! Your emergency fund is well-established. Consider directing extra savings toward long-term investments or specific goals.'
    );
  }
  
  // Recommendation 3: Expense optimization
  const housingRatio = (inputs.rent / plan.summary.totalIncome) * 100;
  if (housingRatio > 30) {
    recommendations.push(
      `Your housing costs are ${housingRatio.toFixed(0)}% of income. Consider ways to reduce this to below 30% for better financial flexibility.`
    );
  } else if (inputs.shopping + inputs.entertainment > plan.allocation.wants.amount) {
    recommendations.push(
      'Your discretionary spending exceeds the recommended allocation. Try the 24-hour rule before making non-essential purchases.'
    );
  } else {
    recommendations.push(
      'Your expense allocation looks balanced! Continue tracking your spending to maintain this healthy pattern.'
    );
  }
  
  // Recommendation 4: Income diversification
  if (!inputs.secondaryIncome && !inputs.passiveIncome) {
    recommendations.push(
      'Consider exploring additional income streams like freelancing, side projects, or passive investments to accelerate your financial goals.'
    );
  }
  
  // Recommendation 5: Automation
  if (inputs.savingStyle === 'manual') {
    recommendations.push(
      'Switch to automatic savings transfers to ensure consistent progress toward your goals without relying on willpower each month.'
    );
  }
  
  return recommendations.slice(0, 5);
}

export function generateActionPlan(
  inputs: BudgetInputs,
  plan: BudgetPlan
): string[] {
  const actions: string[] = [];
  
  // Action 1: Set up savings
  if (inputs.savingStyle === 'manual') {
    actions.push(
      `Set up an automatic transfer of ${Math.round(plan.summary.suggestedSavings)} to your savings account on the day after your salary is credited.`
    );
  } else {
    actions.push(
      `Review and confirm your automatic savings transfer of ${Math.round(plan.summary.suggestedSavings)} is active and scheduled correctly.`
    );
  }
  
  // Action 2: Track expenses
  if (inputs.financialKnowledge === 'beginner') {
    actions.push(
      'Start tracking your daily expenses using a simple app or spreadsheet. Focus on the top 3 categories: food, transport, and entertainment.'
    );
  } else {
    actions.push(
      'Conduct a detailed expense audit this month. Identify one category where you can reduce spending by 10% without impacting your lifestyle.'
    );
  }
  
  // Action 3: Emergency fund or goal-specific
  if ((inputs.emergencyFund || 0) < plan.summary.totalExpenses * 3) {
    actions.push(
      `Prioritize building your emergency fund. Aim to add ${Math.round(plan.summary.suggestedSavings * 0.5)} extra this month by cutting one non-essential expense.`
    );
  } else if (inputs.targetAmount > 0) {
    const monthlyRequired = inputs.targetAmount / (inputs.timeline || 12);
    actions.push(
      `To reach your goal of ${Math.round(inputs.targetAmount)} in ${inputs.timeline || 12} months, ensure you're saving ${Math.round(monthlyRequired)} monthly. Review progress weekly.`
    );
  } else {
    actions.push(
      'Define one specific financial goal for the next 6 months (e.g., vacation fund, course enrollment, or investment). Write it down and calculate the monthly savings needed.'
    );
  }
  
  return actions.slice(0, 3);
}
