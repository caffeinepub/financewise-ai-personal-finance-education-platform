import type { BudgetInputs, BudgetPlan } from '../../types/budget-planner';

export function generateBudgetPlan(inputs: BudgetInputs): BudgetPlan {
  const totalIncome = inputs.monthlyIncome + inputs.secondaryIncome + inputs.passiveIncome;
  
  // Calculate total expenses
  const coreExpenses = inputs.rent + inputs.foodGroceries + inputs.transport;
  const fixedExpenses = inputs.utilities + inputs.internetMobile + inputs.insurance + 
                        inputs.educationFees + inputs.loanEMIs;
  const variableExpenses = inputs.shopping + inputs.entertainment + inputs.travel + inputs.medical;
  
  const totalExpenses = coreExpenses + fixedExpenses + variableExpenses;
  
  // Calculate suggested savings
  let suggestedSavings: number;
  if (inputs.savingsType === 'percentage') {
    suggestedSavings = (totalIncome * inputs.savingsAmount) / 100;
  } else {
    suggestedSavings = inputs.savingsAmount;
  }
  
  // Determine budget rule based on savings preference and goal type
  let rule: string;
  let needsPercentage: number;
  let wantsPercentage: number;
  let savingsPercentage: number;
  
  const savingsRate = (suggestedSavings / totalIncome) * 100;
  
  if (savingsRate >= 30 || inputs.goalType === 'long-term') {
    rule = '60/20/20';
    needsPercentage = 60;
    wantsPercentage = 20;
    savingsPercentage = 20;
  } else if (savingsRate >= 20) {
    rule = '50/30/20';
    needsPercentage = 50;
    wantsPercentage = 30;
    savingsPercentage = 20;
  } else {
    rule = '70/20/10';
    needsPercentage = 70;
    wantsPercentage = 20;
    savingsPercentage = 10;
  }
  
  const needsAmount = (totalIncome * needsPercentage) / 100;
  const wantsAmount = (totalIncome * wantsPercentage) / 100;
  const savingsAmount = (totalIncome * savingsPercentage) / 100;
  
  // Build expense breakdown
  const expenseBreakdown: Array<{ name: string; amount: number; percentage: number }> = [];
  const assumptions: string[] = [];
  
  if (inputs.rent > 0) {
    expenseBreakdown.push({
      name: 'Rent/EMI',
      amount: inputs.rent,
      percentage: (inputs.rent / totalExpenses) * 100,
    });
  }
  
  if (inputs.foodGroceries > 0) {
    expenseBreakdown.push({
      name: 'Food & Groceries',
      amount: inputs.foodGroceries,
      percentage: (inputs.foodGroceries / totalExpenses) * 100,
    });
  }
  
  if (inputs.transport > 0) {
    expenseBreakdown.push({
      name: 'Transport',
      amount: inputs.transport,
      percentage: (inputs.transport / totalExpenses) * 100,
    });
  }
  
  if (fixedExpenses > 0) {
    expenseBreakdown.push({
      name: 'Fixed Expenses',
      amount: fixedExpenses,
      percentage: (fixedExpenses / totalExpenses) * 100,
    });
  } else {
    assumptions.push('Fixed expenses (utilities, internet, insurance) estimated at 10% of income');
  }
  
  if (variableExpenses > 0) {
    expenseBreakdown.push({
      name: 'Variable Expenses',
      amount: variableExpenses,
      percentage: (variableExpenses / totalExpenses) * 100,
    });
  } else {
    assumptions.push('Variable expenses (shopping, entertainment) estimated at 15% of income');
  }
  
  // Add assumptions for missing data
  if (!inputs.secondaryIncome && !inputs.passiveIncome) {
    assumptions.push('Only primary income considered for budget calculations');
  }
  
  if (!inputs.emergencyFund) {
    assumptions.push('Emergency fund target set at 6 months of expenses');
  }
  
  if (!inputs.targetAmount && !inputs.timeline) {
    assumptions.push(`${rule} budgeting rule applied based on your savings preference`);
  }
  
  // Calculate savings progress
  const currentSavings = inputs.emergencyFund || 0;
  const targetSavings = inputs.targetAmount || (totalExpenses * 6);
  const savingsProgressPercentage = Math.min((currentSavings / targetSavings) * 100, 100);
  
  // Calculate cash flow
  const surplus = totalIncome - totalExpenses - suggestedSavings;
  const actualSavingsRate = (suggestedSavings / totalIncome) * 100;
  
  return {
    summary: {
      totalIncome,
      totalExpenses,
      suggestedSavings,
    },
    allocation: {
      rule,
      needs: { amount: needsAmount, percentage: needsPercentage },
      wants: { amount: wantsAmount, percentage: wantsPercentage },
      savings: { amount: savingsAmount, percentage: savingsPercentage },
    },
    expenseBreakdown,
    savingsProgress: {
      current: currentSavings,
      target: targetSavings,
      percentage: savingsProgressPercentage,
    },
    cashFlow: {
      surplus,
      savingsRate: actualSavingsRate,
    },
    assumptions,
  };
}

export type { BudgetInputs };
