import type { BudgetInputs } from './budgetLogic';

export interface Recommendations {
  savingStrategy?: {
    overview: string;
    tips: string[];
  };
  investingGuidance?: {
    overview: string;
    tips: string[];
  };
  financialImprovement?: {
    overview: string;
    tips: string[];
  };
}

export function generateRecommendations(inputs: BudgetInputs, plan: any): Recommendations {
  const savingsRate = (plan.allocations.savings / plan.allocations.totalIncome) * 100;
  const hasDebt = inputs.loanEMIs > 0;
  const hasEmergencyFund = inputs.emergencyFund > 0;
  const monthlyExpenses = plan.allocations.totalExpenses;
  const emergencyFundTarget = monthlyExpenses * 6;
  
  const recommendations: Recommendations = {};
  
  // Saving Strategy
  recommendations.savingStrategy = {
    overview: savingsRate >= 20 
      ? "Your savings rate is excellent! Focus on maintaining this discipline while optimizing where your savings go."
      : savingsRate >= 10
      ? "Your savings rate is good, but there's room for improvement. Small increases can make a big difference over time."
      : "Building a stronger savings habit should be your top priority. Start small and increase gradually.",
    tips: []
  };
  
  if (savingsRate < 20) {
    recommendations.savingStrategy.tips.push(
      "Try the 'pay yourself first' method: automatically transfer savings when you receive income, before spending on anything else."
    );
  }
  
  if (!hasEmergencyFund || inputs.emergencyFund < emergencyFundTarget) {
    recommendations.savingStrategy.tips.push(
      `Build an emergency fund covering 3-6 months of expenses (target: ${Math.round(emergencyFundTarget)}). Keep it in a liquid, easily accessible account.`
    );
  }
  
  if (inputs.savingStyle === 'manual') {
    recommendations.savingStrategy.tips.push(
      "Consider switching to automatic savings transfers. Automation removes the temptation to skip savings and builds consistency."
    );
  }
  
  recommendations.savingStrategy.tips.push(
    "Use the 50/30/20 rule as a baseline: 50% needs, 30% wants, 20% savings. Adjust based on your goals.",
    "Review and cut one unnecessary subscription or expense each month. Redirect those savings to your goals.",
    "Track your spending for 30 days to identify hidden money leaks. Awareness alone often reduces spending by 15-20%."
  );
  
  // Investing Guidance (Beginner-Friendly)
  recommendations.investingGuidance = {
    overview: inputs.financialKnowledge === 'beginner'
      ? "As a beginner, start with simple, low-risk investment options and focus on learning the basics before taking on more complex strategies."
      : inputs.financialKnowledge === 'intermediate'
      ? "With your intermediate knowledge, you can explore diversified portfolios and consider a mix of equity and debt instruments."
      : "With advanced knowledge, you can optimize your portfolio with tax-efficient strategies and explore alternative investments.",
    tips: []
  };
  
  if (inputs.financialKnowledge === 'beginner') {
    recommendations.investingGuidance.tips.push(
      "Start with Systematic Investment Plans (SIPs) in diversified mutual funds. SIPs allow you to invest small amounts regularly, reducing market timing risk.",
      "Learn the basics: understand the difference between equity (stocks), debt (bonds), and hybrid funds before investing.",
      "Begin with low-cost index funds or ETFs that track broad market indices. These offer instant diversification and lower fees."
    );
  }
  
  if (inputs.riskTolerance === 'low') {
    recommendations.investingGuidance.tips.push(
      "Focus on debt funds, fixed deposits, and government bonds for stable, predictable returns with lower risk.",
      "Allocate 70-80% to debt instruments and 20-30% to equity for balanced growth with capital protection."
    );
  } else if (inputs.riskTolerance === 'medium') {
    recommendations.investingGuidance.tips.push(
      "A balanced 60/40 portfolio (60% equity, 40% debt) suits your moderate risk tolerance and offers growth with stability.",
      "Consider diversified equity mutual funds for long-term wealth creation, paired with debt funds for stability."
    );
  } else {
    recommendations.investingGuidance.tips.push(
      "With high risk tolerance, you can allocate 70-80% to equity for maximum long-term growth potential.",
      "Explore direct equity investments, sector funds, and small-cap funds for higher returns (with higher volatility)."
    );
  }
  
  if (inputs.goalType === 'long-term') {
    recommendations.investingGuidance.tips.push(
      "For long-term goals (3+ years), equity investments historically outperform other asset classes. Stay invested and avoid panic selling during market dips.",
      "Take advantage of compounding: the longer you stay invested, the more your returns multiply. Time in the market beats timing the market."
    );
  } else {
    recommendations.investingGuidance.tips.push(
      "For short-term goals (1-3 years), prioritize capital preservation. Use liquid funds, short-term debt funds, or fixed deposits.",
      "Avoid high-risk equity investments for short-term goals. Market volatility can erode capital when you need it soon."
    );
  }
  
  recommendations.investingGuidance.tips.push(
    "Diversify across asset classes (equity, debt, gold) to reduce risk. Don't put all your eggs in one basket.",
    "Reinvest dividends and returns to maximize compounding. Small reinvestments grow significantly over time."
  );
  
  // Financial Improvement
  recommendations.financialImprovement = {
    overview: "Improving your finances is a gradual process. Focus on building good habits, reducing unnecessary expenses, and increasing your financial literacy.",
    tips: []
  };
  
  if (hasDebt) {
    recommendations.financialImprovement.tips.push(
      "Prioritize high-interest debt repayment (credit cards, personal loans). Use the debt avalanche method: pay off highest-interest debt first while maintaining minimums on others.",
      `Your current loan EMIs are ${Math.round(inputs.loanEMIs)}. Try to pay extra toward principal when possible to reduce interest costs and shorten loan tenure.`
    );
  }
  
  if (inputs.spendingBehavior === 'spender') {
    recommendations.financialImprovement.tips.push(
      "Practice the 24-hour rule: wait 24 hours before making non-essential purchases. This reduces impulsive spending.",
      "Identify your spending triggers (stress, boredom, social pressure) and develop healthier coping mechanisms."
    );
  }
  
  if (inputs.secondaryIncome === 0 && inputs.passiveIncome === 0) {
    recommendations.financialImprovement.tips.push(
      "Consider developing a secondary income stream (freelancing, online tutoring, digital products). Multiple income sources reduce financial stress and accelerate goal achievement.",
      "Explore passive income opportunities: rental income, dividend-paying stocks, or creating digital assets that generate recurring revenue."
    );
  }
  
  recommendations.financialImprovement.tips.push(
    "Increase your financial literacy: read personal finance books, follow reputable finance blogs, and take free online courses.",
    "Review your budget monthly and adjust as needed. Life changes, and your budget should adapt to your evolving circumstances.",
    "Set specific, measurable financial goals with deadlines. Vague goals like 'save more' are less effective than 'save 50,000 in 12 months for vacation.'",
    "Negotiate bills and subscriptions annually. Many service providers offer discounts to retain customers—just ask.",
    "Invest in yourself: skills development, certifications, and education often yield the highest returns by increasing your earning potential."
  );
  
  return recommendations;
}

export function generateActionPlan(inputs: BudgetInputs, plan: any): string[] {
  const actionPlan: string[] = [];
  
  // Step 1: Immediate action
  if (inputs.savingStyle === 'manual') {
    actionPlan.push(
      `Set up automatic transfers: Schedule ${Math.round(plan.allocations.savings)} to move from your checking account to a savings account on payday. Automation ensures consistency.`
    );
  } else {
    actionPlan.push(
      `Review your current automatic savings: Ensure ${Math.round(plan.allocations.savings)} is being saved monthly. Adjust if needed to match your new budget plan.`
    );
  }
  
  // Step 2: Expense optimization
  const hasHighDiscretionary = plan.allocations.wants > plan.allocations.needs * 0.6;
  if (hasHighDiscretionary) {
    actionPlan.push(
      `Audit discretionary spending: Review your 'wants' category (${Math.round(plan.allocations.wants)}/month). Identify 2-3 expenses you can reduce or eliminate without significantly impacting your lifestyle. Redirect savings to your financial goals.`
    );
  } else {
    actionPlan.push(
      `Track all expenses for 30 days: Use a simple app or spreadsheet to record every purchase. This awareness exercise often reveals 15-20% in unnecessary spending that can be redirected to savings or debt repayment.`
    );
  }
  
  // Step 3: Long-term planning
  if (inputs.loanEMIs > 0) {
    actionPlan.push(
      `Create a debt repayment strategy: List all debts by interest rate. Focus extra payments on the highest-interest debt while maintaining minimums on others. Even small extra payments significantly reduce total interest paid.`
    );
  } else if (!inputs.emergencyFund || inputs.emergencyFund < plan.allocations.totalExpenses * 3) {
    actionPlan.push(
      `Build your emergency fund: Aim for 3-6 months of expenses (${Math.round(plan.allocations.totalExpenses * 6)}). Start with a smaller goal of ${Math.round(plan.allocations.totalExpenses)} and increase gradually. Keep it in a liquid, easily accessible account.`
    );
  } else {
    actionPlan.push(
      `Start investing for long-term goals: Open a SIP in a diversified mutual fund or index fund. Begin with a small amount (even ${Math.round(plan.allocations.savings * 0.3)}) and increase as you get comfortable. Consistency matters more than amount.`
    );
  }
  
  return actionPlan;
}
