import type { BudgetInputs, BudgetPlan } from '../../types/budget-planner';

export function calculateHealthScore(
  inputs: BudgetInputs,
  plan: BudgetPlan
): { score: number; explanation: string } {
  let score = 0;
  const factors: string[] = [];
  
  // Factor 1: Savings Rate (30 points)
  const savingsRate = plan.cashFlow.savingsRate;
  if (savingsRate >= 30) {
    score += 30;
    factors.push('excellent savings rate');
  } else if (savingsRate >= 20) {
    score += 25;
    factors.push('good savings rate');
  } else if (savingsRate >= 10) {
    score += 15;
    factors.push('moderate savings rate');
  } else {
    score += 5;
    factors.push('low savings rate');
  }
  
  // Factor 2: Cash Flow (25 points)
  if (plan.cashFlow.surplus > 0) {
    const surplusRate = (plan.cashFlow.surplus / plan.summary.totalIncome) * 100;
    if (surplusRate >= 10) {
      score += 25;
      factors.push('healthy cash surplus');
    } else if (surplusRate >= 5) {
      score += 20;
      factors.push('positive cash flow');
    } else {
      score += 15;
      factors.push('minimal surplus');
    }
  } else {
    score += 5;
    factors.push('negative cash flow');
  }
  
  // Factor 3: Emergency Fund (20 points)
  const emergencyFundMonths = inputs.emergencyFund / (plan.summary.totalExpenses || 1);
  if (emergencyFundMonths >= 6) {
    score += 20;
    factors.push('strong emergency fund');
  } else if (emergencyFundMonths >= 3) {
    score += 15;
    factors.push('adequate emergency fund');
  } else if (emergencyFundMonths >= 1) {
    score += 10;
    factors.push('building emergency fund');
  } else {
    score += 5;
    factors.push('needs emergency fund');
  }
  
  // Factor 4: Debt Management (15 points)
  const debtRatio = (inputs.loanEMIs / plan.summary.totalIncome) * 100;
  if (debtRatio === 0) {
    score += 15;
    factors.push('debt-free');
  } else if (debtRatio <= 20) {
    score += 12;
    factors.push('manageable debt');
  } else if (debtRatio <= 40) {
    score += 8;
    factors.push('moderate debt');
  } else {
    score += 3;
    factors.push('high debt burden');
  }
  
  // Factor 5: Financial Planning (10 points)
  if (inputs.retirementPlanning > 0 && inputs.targetAmount > 0) {
    score += 10;
    factors.push('comprehensive planning');
  } else if (inputs.retirementPlanning > 0 || inputs.targetAmount > 0) {
    score += 7;
    factors.push('some planning in place');
  } else {
    score += 3;
    factors.push('needs more planning');
  }
  
  // Generate explanation
  const explanation = `Your financial health is ${getHealthLevel(score)} based on ${factors.slice(0, 3).join(', ')}. ${getHealthAdvice(score)}`;
  
  return { score, explanation };
}

function getHealthLevel(score: number): string {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'very good';
  if (score >= 55) return 'good';
  if (score >= 40) return 'fair';
  return 'needs improvement';
}

function getHealthAdvice(score: number): string {
  if (score >= 85) {
    return 'Keep up the great work! You\'re on track for long-term financial success.';
  } else if (score >= 70) {
    return 'You\'re doing well! Focus on maintaining consistency and exploring growth opportunities.';
  } else if (score >= 55) {
    return 'You\'re on the right path. Consider increasing your savings rate and building your emergency fund.';
  } else if (score >= 40) {
    return 'There\'s room for improvement. Focus on reducing expenses and increasing your savings.';
  } else {
    return 'Let\'s work on building a stronger financial foundation. Start with small, consistent steps.';
  }
}
