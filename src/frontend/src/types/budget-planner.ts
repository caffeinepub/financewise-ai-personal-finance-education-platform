export interface BudgetInputs {
  monthlyIncome: number;
  rent: number;
  foodGroceries: number;
  transport: number;
  savingsAmount: number;
  savingsType: 'amount' | 'percentage';
  goalType: 'short-term' | 'long-term';
  secondaryIncome: number;
  passiveIncome: number;
  utilities: number;
  internetMobile: number;
  insurance: number;
  educationFees: number;
  loanEMIs: number;
  shopping: number;
  entertainment: number;
  travel: number;
  medical: number;
  emergencyFund: number;
  retirementPlanning: number;
  targetAmount: number;
  timeline: number;
  riskTolerance: 'low' | 'medium' | 'high';
  spendingBehavior: 'saver' | 'spender';
  savingStyle: 'auto' | 'manual';
  financialKnowledge: 'beginner' | 'intermediate' | 'advanced';
}

export interface BudgetPlan {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    suggestedSavings: number;
  };
  allocation: {
    rule: string;
    needs: { amount: number; percentage: number };
    wants: { amount: number; percentage: number };
    savings: { amount: number; percentage: number };
  };
  expenseBreakdown: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  savingsProgress: {
    current: number;
    target: number;
    percentage: number;
  };
  cashFlow: {
    surplus: number;
    savingsRate: number;
  };
  assumptions: string[];
}
