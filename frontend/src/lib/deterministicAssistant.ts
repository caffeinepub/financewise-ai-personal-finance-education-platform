// Deterministic AI assistant engine for finance queries
// Generates structured responses without external LLM/API calls

export interface AssistantContext {
  balance?: number;
  recentTransactions?: Array<{ amount: number; category: string; transactionType: string }>;
  totalTransactions?: number;
  totalIncome?: number;
  totalExpenses?: number;
  savingsGoals?: Array<{ name: string; targetAmount: number; currentAmount: number }>;
  hasData?: boolean;
}

export interface AssistantResponse {
  content: string;
  needsClarification: boolean;
  disclaimer?: string;
}

type QueryCategory = 'stocks' | 'investing' | 'budgeting' | 'saving' | 'expenses' | 'general';

// Classify query into categories
export function classifyQuery(query: string): QueryCategory {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.match(/\b(stock|share|equity|market|trading|ticker|portfolio|diversif)/)) {
    return 'stocks';
  }
  if (lowerQuery.match(/\b(invest|mutual fund|sip|bond|asset|return|roi)/)) {
    return 'investing';
  }
  if (lowerQuery.match(/\b(budget|expense|spend|track|allocat)/)) {
    return 'budgeting';
  }
  if (lowerQuery.match(/\b(save|saving|emergency fund|goal)/)) {
    return 'saving';
  }
  if (lowerQuery.match(/\b(expense|cost|reduce|cut|lower|control)/)) {
    return 'expenses';
  }
  return 'general';
}

// Check if query is too vague
function isVagueQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  const vaguePatterns = [
    /^(help|what|how|tell me|explain)$/,
    /^(help|what|how|tell me|explain)\s+\w{1,5}$/,
    /^(hi|hello|hey)$/,
  ];
  return vaguePatterns.some(pattern => pattern.test(lowerQuery));
}

// Generate clarifying questions
function generateClarifyingQuestions(query: string): string {
  return `I'd be happy to help! Could you please be more specific? For example:

**Budgeting & Planning:**
• "How do I create a monthly budget?"
• "What's the 50/30/20 budgeting rule?"
• "How can I track my expenses better?"

**Saving Money:**
• "How much should I save each month?"
• "What's an emergency fund and how do I build one?"
• "Tips for saving money on a tight budget"

**Investing:**
• "What is SIP investment?"
• "How do mutual funds work?"
• "Should I invest in stocks or bonds?"

**Stocks & Markets:**
• "What are stocks and how do they work?"
• "How do I start investing in the stock market?"
• "What's diversification in investing?"

**Reducing Expenses:**
• "How can I reduce my monthly expenses?"
• "What expenses can I cut without affecting my lifestyle?"
• "Tips for avoiding unnecessary spending"`;
}

// Generate data-aware context prefix
function generateDataAwarePrefix(context: AssistantContext): string {
  if (!context.hasData) {
    return `**Note:** I don't see any financial data in your account yet. To get personalized advice based on your actual spending and goals, please add some transactions and savings goals first.\n\n`;
  }

  const parts: string[] = [];
  
  if (context.balance !== undefined) {
    parts.push(`Current Balance: ${context.balance.toFixed(2)}`);
  }
  
  if (context.totalIncome !== undefined && context.totalIncome > 0) {
    parts.push(`Total Income: ${context.totalIncome.toFixed(2)}`);
  }
  
  if (context.totalExpenses !== undefined && context.totalExpenses > 0) {
    parts.push(`Total Expenses: ${context.totalExpenses.toFixed(2)}`);
  }
  
  if (context.savingsGoals && context.savingsGoals.length > 0) {
    const activeGoals = context.savingsGoals.length;
    const totalGoalAmount = context.savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = context.savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    parts.push(`Active Goals: ${activeGoals} (${totalSaved.toFixed(2)} of ${totalGoalAmount.toFixed(2)} saved)`);
  }

  if (parts.length > 0) {
    return `**Based on your data:** ${parts.join(' • ')}\n\n`;
  }

  return '';
}

// Generate response for budgeting queries
function generateBudgetingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  const dataPrefix = generateDataAwarePrefix(context);
  
  if (lowerQuery.includes('50/30/20') || lowerQuery.includes('rule')) {
    return `${dataPrefix}**The 50/30/20 Budgeting Rule**

This simple budgeting framework divides your after-tax income into three categories:

**50% - Needs (Essential Expenses)**
• Housing (rent/mortgage)
• Utilities (electricity, water, internet)
• Groceries and food
• Transportation
• Insurance
• Minimum debt payments

**30% - Wants (Discretionary Spending)**
• Entertainment and hobbies
• Dining out
• Shopping
• Subscriptions (streaming, gym)
• Travel and vacations

**20% - Savings & Debt Repayment**
• Emergency fund
• Retirement savings
• Extra debt payments
• Investment contributions

**How to Apply It:**
1. Calculate your monthly after-tax income
2. Multiply by 0.5, 0.3, and 0.2 to get your category limits
3. Track your spending to stay within each category
4. Adjust percentages based on your situation (e.g., 60/20/20 if you have high debt)

**Pro Tip:** Start by tracking your current spending for a month to see where you stand, then gradually adjust toward the 50/30/20 split.`;
  }
  
  if (lowerQuery.includes('create') || lowerQuery.includes('start') || lowerQuery.includes('make')) {
    return `${dataPrefix}**How to Create a Monthly Budget (Step-by-Step)**

**Step 1: Calculate Your Income**
• Add up all sources of income (salary, freelance, side hustles)
• Use your after-tax (take-home) amount

**Step 2: List Your Fixed Expenses**
• Rent/mortgage
• Utilities
• Insurance
• Loan payments
• Subscriptions

**Step 3: Estimate Variable Expenses**
• Groceries
• Transportation
• Entertainment
• Dining out
• Personal care

**Step 4: Set Savings Goals**
• Emergency fund (aim for 3-6 months of expenses)
• Short-term goals (vacation, gadgets)
• Long-term goals (retirement, home)

**Step 5: Track and Adjust**
• Use apps or spreadsheets to track daily spending
• Review weekly to stay on track
• Adjust categories as needed

**Budgeting Methods to Try:**
• 50/30/20 Rule (simple and flexible)
• Zero-Based Budget (every rupee has a job)
• Envelope System (cash-based spending limits)

**Quick Win:** Start with just tracking your expenses for 2 weeks—you'll be surprised where your money goes!`;
  }
  
  return `${dataPrefix}**Budgeting Basics**

Budgeting is simply planning how you'll spend your money each month. Here's why it matters:

**Benefits:**
• Know exactly where your money goes
• Avoid overspending and debt
• Save for goals faster
• Reduce financial stress

**Simple Budget Formula:**
Income - Savings - Fixed Expenses - Variable Expenses = Leftover

**Quick Start:**
1. Track your spending for 1 month
2. Categorize expenses (needs vs wants)
3. Set spending limits for each category
4. Review and adjust monthly

Would you like to know about specific budgeting methods like the 50/30/20 rule?`;
}

// Generate response for saving queries
function generateSavingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  const dataPrefix = generateDataAwarePrefix(context);
  
  if (lowerQuery.includes('emergency fund')) {
    return `${dataPrefix}**Building an Emergency Fund**

An emergency fund is money set aside for unexpected expenses like medical bills, car repairs, or job loss.

**How Much to Save:**
• **Minimum:** 3 months of essential expenses
• **Ideal:** 6 months of expenses
• **High-risk jobs:** 9-12 months

**How to Build It:**

**Step 1: Calculate Your Target**
• List monthly essentials (rent, food, utilities, insurance)
• Multiply by 3-6 months
• Example: $30,000/month × 6 = $180,000 target

**Step 2: Start Small**
• Begin with $500-1,000 per month
• Increase as you adjust your budget
• Even $10,000 is better than nothing!

**Step 3: Automate Savings**
• Set up automatic transfer on payday
• Use a separate savings account
• Make it "out of sight, out of mind"

**Where to Keep It:**
• High-yield savings account (easy access, earns interest)
• Liquid mutual funds (slightly higher returns)
• NOT in stocks or locked deposits

**Pro Tip:** Start with a mini-goal of $10,000. Once you hit it, you'll feel motivated to keep going!`;
  }
  
  if (lowerQuery.includes('how much') || lowerQuery.includes('percentage')) {
    return `${dataPrefix}**How Much Should You Save Each Month?**

**General Guidelines:**

**The 50/30/20 Rule:**
• Save 20% of your after-tax income
• Example: $50,000 income → $10,000 savings

**By Life Stage:**
• **20s:** 10-15% (building emergency fund)
• **30s:** 15-20% (family, home, retirement)
• **40s:** 20-25% (peak earning years)
• **50s+:** 25-30% (retirement approaching)

**Realistic Starting Points:**
• **Tight budget:** Start with 5% and increase by 1% every 3 months
• **Comfortable:** Aim for 15-20%
• **High income:** Push for 30%+

**Remember:** Saving something is better than saving nothing. Start where you can and increase gradually!`;
  }
  
  return `${dataPrefix}**Smart Saving Strategies**

**Core Principles:**
• **Pay yourself first** - Save before spending
• **Automate** - Set up automatic transfers
• **Start small** - Even $500/month builds up
• **Increase gradually** - Add 1% more every few months

**Saving Goals Priority:**
1. **Emergency Fund** (3-6 months expenses)
2. **High-interest debt payoff**
3. **Retirement savings**
4. **Short-term goals** (vacation, gadgets)
5. **Long-term goals** (home, education)

Would you like specific advice on building an emergency fund or saving on a tight budget?`;
}

// Generate response for expense control queries
function generateExpenseControlResponse(query: string, context: AssistantContext): string {
  const dataPrefix = generateDataAwarePrefix(context);
  
  return `${dataPrefix}**How to Control and Reduce Expenses**

**Immediate Actions:**

**1. Track Everything for 30 Days**
• Write down every purchase
• Categorize spending
• Identify patterns and leaks

**2. Cut the "Big Three"**
• **Housing:** Negotiate rent, get roommate, downsize
• **Transportation:** Public transit, carpool, bike
• **Food:** Meal prep, cook at home, buy in bulk

**3. Cancel Subscriptions**
• Review all recurring charges
• Cancel unused services
• Negotiate better rates

**4. The 24-Hour Rule**
• Wait 24 hours before non-essential purchases
• Most impulse buys lose appeal
• Saves hundreds monthly

**Smart Shopping:**
• Make shopping lists and stick to them
• Buy generic brands
• Use coupons and cashback apps
• Shop sales and clearance

**Pro Tip:** Focus on reducing one category at a time. Once you master that, move to the next!`;
}

// Generate response for investing queries
function generateInvestingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  const dataPrefix = generateDataAwarePrefix(context);
  
  const disclaimer = '\n\n**⚠️ Important Disclaimer:** This is educational information only, not financial advice. Investing involves risk. Consult a certified financial advisor before making investment decisions.';
  
  if (lowerQuery.includes('sip')) {
    return `${dataPrefix}**SIP (Systematic Investment Plan) Explained**

SIP is a method of investing a fixed amount regularly in mutual funds.

**How It Works:**
• Invest a fixed amount monthly (e.g., $1,000, $5,000, $10,000)
• Money automatically deducted from your bank account
• Units purchased at current market price
• Continues every month for your chosen duration

**Key Benefits:**

**1. Rupee Cost Averaging**
• Buy more units when prices are low
• Buy fewer units when prices are high
• Averages out your purchase cost over time

**2. Power of Compounding**
• Returns generate more returns
• Long-term wealth creation

**3. Disciplined Investing**
• Automatic, no need to remember
• Removes emotion from investing
• Builds wealth habit

**How to Start:**
1. Choose a mutual fund (equity, debt, or hybrid)
2. Decide monthly amount
3. Set up auto-debit from bank
4. Stay invested for 5+ years

**Pro Tip:** Start small ($1,000-2,000) and increase by 10% every year as your income grows!${disclaimer}`;
  }
  
  return `${dataPrefix}**Investing Basics**

Investing is putting your money to work to generate returns over time.

**Key Principles:**
• Start early (time is your biggest advantage)
• Diversify (don't put all eggs in one basket)
• Stay invested long-term (5+ years)
• Invest regularly (SIP approach)

**Common Investment Options:**
• Mutual Funds (professionally managed)
• Stocks (direct equity)
• Bonds (fixed income)
• Real Estate
• Gold

**For Beginners:**
Start with mutual fund SIPs - they're simple, diversified, and professionally managed.${disclaimer}`;
}

// Main response generator
export function generateResponse(query: string, context: AssistantContext): AssistantResponse {
  // Check for vague queries
  if (isVagueQuery(query)) {
    return {
      content: generateClarifyingQuestions(query),
      needsClarification: true,
    };
  }

  // Classify and route to appropriate handler
  const category = classifyQuery(query);
  
  let content: string;
  
  switch (category) {
    case 'budgeting':
      content = generateBudgetingResponse(query, context);
      break;
    case 'saving':
      content = generateSavingResponse(query, context);
      break;
    case 'expenses':
      content = generateExpenseControlResponse(query, context);
      break;
    case 'investing':
    case 'stocks':
      content = generateInvestingResponse(query, context);
      break;
    default:
      content = `I can help you with:

• **Budgeting** - Creating budgets, tracking expenses
• **Saving** - Building emergency funds, saving strategies
• **Investing** - SIPs, mutual funds, stocks
• **Expense Control** - Reducing costs, optimizing spending

Please ask a specific question about any of these topics!`;
  }

  return {
    content,
    needsClarification: false,
  };
}
