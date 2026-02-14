import type { BudgetInputs } from './budgetLogic';

export interface ProjectionData {
  month: string;
  monthlySavings: number;
  cumulativeSavings: number;
}

export function generateProjection(inputs: BudgetInputs, plan: any): ProjectionData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate monthly savings from the plan
  const monthlySavings = plan.allocations.savings;
  
  // Generate 12-month projection
  const projection: ProjectionData[] = [];
  let cumulative = 0;
  
  for (let i = 0; i < 12; i++) {
    cumulative += monthlySavings;
    projection.push({
      month: months[i],
      monthlySavings: Math.round(monthlySavings),
      cumulativeSavings: Math.round(cumulative),
    });
  }
  
  return projection;
}
