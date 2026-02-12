import type { BudgetInputs, BudgetPlan } from '../../types/budget-planner';

export interface ProjectionData {
  monthlyData: Array<{
    month: string;
    monthlySavings: number;
    cumulativeSavings: number;
    netCashflow: number;
  }>;
  summary: {
    totalSavingsYear: number;
    averageMonthlySavings: number;
    projectedGrowth: number;
  };
}

export function generateProjection(
  inputs: BudgetInputs,
  plan: BudgetPlan
): ProjectionData {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData: ProjectionData['monthlyData'] = [];
  
  // Base monthly savings from the plan
  const baseMonthlySavings = plan.summary.suggestedSavings;
  
  // Calculate cumulative savings over 12 months
  let cumulativeSavings = 0;
  
  for (let i = 0; i < 12; i++) {
    // Add slight variation based on spending behavior
    const variation = inputs.spendingBehavior === 'saver' ? 1.02 : 0.98;
    const monthlySavings = baseMonthlySavings * (variation ** i);
    
    cumulativeSavings += monthlySavings;
    
    monthlyData.push({
      month: monthNames[i],
      monthlySavings: Math.round(monthlySavings),
      cumulativeSavings: Math.round(cumulativeSavings),
      netCashflow: Math.round(plan.cashFlow.surplus),
    });
  }
  
  const totalSavingsYear = cumulativeSavings;
  const averageMonthlySavings = totalSavingsYear / 12;
  const projectedGrowth = ((totalSavingsYear - (baseMonthlySavings * 12)) / (baseMonthlySavings * 12)) * 100;
  
  return {
    monthlyData,
    summary: {
      totalSavingsYear: Math.round(totalSavingsYear),
      averageMonthlySavings: Math.round(averageMonthlySavings),
      projectedGrowth: Math.round(projectedGrowth * 10) / 10,
    },
  };
}
