// Deterministic AI assistant engine for finance queries
// Generates structured responses without external LLM/API calls

interface AssistantContext {
  balance?: number;
  recentTransactions?: Array<{ amount: number; category: string; transactionType: string }>;
  totalTransactions?: number;
  totalIncome?: number;
  totalExpenses?: number;
  savingsGoals?: Array<{ name: string; targetAmount: number; currentAmount: number }>;
  hasData?: boolean;
}

interface AssistantResponse {
  content: string;
  needsClarification: boolean;
  disclaimer?: string;
}

type QueryCategory = 'stocks' | 'investing' | 'budgeting' | 'saving' | 'expenses' | 'general';

// Classify query into categories
function classifyQuery(query: string): QueryCategory {
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
  
  if (lowerQuery.includes('track')) {
    return `${dataPrefix}**Best Ways to Track Your Expenses**

**Digital Tools:**
• **Mobile Apps:** Use expense tracking apps (many are free)
• **Spreadsheets:** Create a simple Google Sheet or Excel file
• **Banking Apps:** Most banks now categorize transactions automatically

**Manual Methods:**
• **Notebook:** Write down every expense daily
• **Receipt Jar:** Keep all receipts and review weekly
• **Envelope System:** Allocate cash to categories

**Tracking Tips:**
1. **Record immediately** - Don't wait until end of day
2. **Categorize consistently** - Use the same categories each time
3. **Review weekly** - Spot patterns and adjust
4. **Be honest** - Track everything, even small purchases
5. **Set alerts** - Use app notifications for overspending

**What to Track:**
• Date and amount
• Category (food, transport, entertainment, etc.)
• Payment method (cash, card, UPI)
• Notes (why you bought it)

**Pro Tip:** The first month is just data collection—don't judge yourself. After 30 days, you'll have a clear picture of your spending habits and can make informed changes.`;
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

**Common Budget Categories:**
• Housing & Utilities
• Food & Groceries
• Transportation
• Insurance
• Debt Payments
• Entertainment
• Savings

Would you like to know about specific budgeting methods like the 50/30/20 rule or zero-based budgeting?`;
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
• Example: ₹30,000/month × 6 = ₹1,80,000 target

**Step 2: Start Small**
• Begin with ₹500-1,000 per month
• Increase as you adjust your budget
• Even ₹10,000 is better than nothing!

**Step 3: Automate Savings**
• Set up automatic transfer on payday
• Use a separate savings account
• Make it "out of sight, out of mind"

**Step 4: Boost Your Fund**
• Save windfalls (bonuses, tax refunds, gifts)
• Cut one unnecessary expense
• Sell items you don't use

**Where to Keep It:**
• High-yield savings account (easy access, earns interest)
• Liquid mutual funds (slightly higher returns)
• NOT in stocks or locked deposits

**When to Use It:**
✅ Medical emergencies
✅ Urgent home/car repairs
✅ Job loss
❌ Vacations
❌ Shopping
❌ Planned expenses

**Pro Tip:** Start with a mini-goal of ₹10,000. Once you hit it, you'll feel motivated to keep going!`;
  }
  
  if (lowerQuery.includes('how much') || lowerQuery.includes('percentage')) {
    return `${dataPrefix}**How Much Should You Save Each Month?**

**General Guidelines:**

**The 50/30/20 Rule:**
• Save 20% of your after-tax income
• Example: ₹50,000 income → ₹10,000 savings

**By Life Stage:**
• **20s:** 10-15% (building emergency fund)
• **30s:** 15-20% (family, home, retirement)
• **40s:** 20-25% (peak earning years)
• **50s+:** 25-30% (retirement approaching)

**By Financial Goal:**
• **Emergency Fund:** Save aggressively until you have 6 months of expenses
• **Short-term goals (1-3 years):** 10-20% of income
• **Long-term goals (retirement):** 15-20% of income

**Realistic Starting Points:**
• **Tight budget:** Start with 5% and increase by 1% every 3 months
• **Comfortable:** Aim for 15-20%
• **High income:** Push for 30%+

**How to Increase Savings:**
1. **Pay yourself first** - Save before spending
2. **Automate** - Set up automatic transfers
3. **Round up** - Save spare change
4. **Save windfalls** - Bonuses, tax refunds, gifts
5. **Cut one expense** - Cancel unused subscriptions

**Example Savings Plan (₹50,000 monthly income):**
• Emergency fund: ₹5,000/month (10%)
• Retirement: ₹3,000/month (6%)
• Short-term goals: ₹2,000/month (4%)
• **Total: ₹10,000/month (20%)**

**Remember:** Saving something is better than saving nothing. Start where you can and increase gradually!`;
  }
  
  if (lowerQuery.includes('tight budget') || lowerQuery.includes('low income')) {
    return `${dataPrefix}**Saving Money on a Tight Budget**

Even with limited income, you can build savings with these strategies:

**1. Start Micro-Small**
• Save ₹50-100 per week (₹200-400/month)
• Use a piggy bank or separate account
• Small amounts add up over time

**2. Cut the "Invisible" Expenses**
• Cancel unused subscriptions (streaming, gym, apps)
• Reduce eating out by 50%
• Switch to cheaper phone/internet plans
• Buy generic brands instead of premium

**3. The 24-Hour Rule**
• Wait 24 hours before any non-essential purchase
• Most impulse buys lose appeal after a day
• Saves hundreds per month

**4. Free Entertainment**
• Use library instead of buying books
• Free YouTube workouts instead of gym
• Picnics instead of restaurants
• Free community events

**5. Reduce Big Three Expenses**
• **Housing:** Get a roommate or move to cheaper area
• **Transportation:** Use public transport, carpool, bike
• **Food:** Meal prep, buy in bulk, cook at home

**6. Earn Extra Income**
• Freelance your skills online
• Sell unused items
• Part-time gig work
• Tutoring or consulting

**7. Use Cash-Back & Rewards**
• Credit card rewards (if you pay in full)
• Cashback apps for groceries
• Loyalty programs

**8. The Spare Change Method**
• Round up purchases to nearest ₹10
• Save the difference
• Example: ₹47 purchase → save ₹3

**9. Challenge Yourself**
• No-spend weekends
• 30-day spending freeze on one category
• Cook all meals at home for a week

**10. Track Everything**
• Write down every expense
• You'll naturally spend less when aware

**Realistic Goal:** Save ₹1,000-2,000/month even on a tight budget. In one year, that's ₹12,000-24,000 emergency fund!

**Remember:** Every rupee saved is a rupee earned. Start small, stay consistent, and celebrate small wins!`;
  }
  
  return `${dataPrefix}**Smart Saving Strategies**

**Core Principles:**
• **Pay yourself first** - Save before spending
• **Automate** - Set up automatic transfers
• **Start small** - Even ₹500/month builds up
• **Increase gradually** - Add 1% more every few months

**Saving Goals Priority:**
1. **Emergency Fund** (3-6 months expenses)
2. **High-interest debt payoff**
3. **Retirement savings**
4. **Short-term goals** (vacation, gadgets)
5. **Long-term goals** (home, education)

**Quick Wins:**
• Cancel unused subscriptions
• Pack lunch instead of eating out
• Use cashback and rewards programs
• Buy generic brands
• Wait 24 hours before non-essential purchases

**Savings Accounts:**
• High-yield savings (emergency fund)
• Fixed deposits (short-term goals)
• Mutual funds (long-term growth)

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

**5. Use Cash for Discretionary Spending**
• Withdraw weekly allowance
• When cash is gone, stop spending
• Makes spending more "real"

**Smart Shopping:**
• Make shopping lists and stick to them
• Buy generic brands
• Use coupons and cashback apps
• Shop sales and clearance
• Avoid shopping when emotional

**Lifestyle Adjustments:**
• Cook at home (saves 50-70% vs eating out)
• Free entertainment (library, parks, YouTube)
• DIY repairs and maintenance
• Buy used or refurbished items
• Share subscriptions with family

**Monthly Review:**
• Compare spending to budget
• Celebrate wins
• Adjust categories as needed
• Set new reduction goals

**Pro Tip:** Focus on reducing one category at a time. Once you master that, move to the next. Small wins build momentum!`;
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
• Invest a fixed amount monthly (e.g., ₹1,000, ₹5,000, ₹10,000)
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
• Example: ₹5,000/month for 20 years at 12% = ₹50 lakhs+

**3. Disciplined Investing**
• Automatic, no need to remember
• Removes emotion from investing
• Builds wealth habit

**4. Flexibility**
• Start with as little as ₹500/month
• Increase, decrease, or pause anytime
• No penalty for stopping

**5. No Market Timing Needed**
• Don't need to predict market highs/lows
• Invest in all market conditions
• Reduces risk of bad timing

**How to Start:**
1. Choose a mutual fund (equity, debt, or hybrid)
2. Decide monthly amount
3. Set up auto-debit from bank
4. Stay invested for 5+ years

**Example:**
• Monthly SIP: ₹5,000
• Duration: 15 years
• Expected return: 12% per year
• **Total invested:** ₹9,00,000
• **Estimated value:** ₹25,00,000+

**Best For:**
• Long-term goals (5+ years)
• First-time investors
• Regular income earners
• Building retirement corpus

**Pro Tip:** Start small (₹1,000-2,000) and increase by 10% every year as your income grows!${disclaimer}`;
  }
  
  if (lowerQuery.includes('mutual fund')) {
    return `${dataPrefix}**Mutual Funds Explained Simply**

A mutual fund pools money from many investors to invest in stocks, bonds, or other assets.

**How It Works:**
• You and thousands of others invest money
• Professional fund manager invests the pooled money
• Returns are distributed proportionally
• You can buy/sell units anytime

**Types of Mutual Funds:**

**1. Equity Funds (Stock-based)**
• Invest in company stocks
• Higher risk, higher potential returns
• Best for long-term (5+ years)
• Expected return: 10-15% per year

**2. Debt Funds (Bond-based)**
• Invest in government/corporate bonds
• Lower risk, stable returns
• Best for short-term (1-3 years)
• Expected return: 6-8% per year

**3. Hybrid Funds (Mixed)**
• Combination of stocks and bonds
• Balanced risk and return
• Good for moderate risk-takers
• Expected return: 8-12% per year

**Why Invest in Mutual Funds?**

**Advantages:**
• Professional management
• Diversification (reduces risk)
• Low minimum investment (₹500+)
• High liquidity (easy to sell)
• Regulated and transparent

**Disadvantages:**
• Management fees (expense ratio)
• No guaranteed returns
• Market risk
• Tax on gains

**How to Choose:**
• **Goal:** Short-term → Debt funds, Long-term → Equity funds
• **Risk appetite:** Low → Debt, High → Equity
• **Time horizon:** <3 years → Debt, 5+ years → Equity

**Costs:**
• Expense ratio: 0.5-2.5% per year
• Exit load: 1% if sold within 1 year (varies)
• No entry fees

**How to Invest:**
1. Complete KYC (one-time)
2. Choose fund based on goal and risk
3. Invest lump sum or via SIP
4. Monitor annually, don't check daily

**Pro Tip:** For beginners, start with a diversified equity fund via SIP. Stay invested for at least 5 years to see good returns!${disclaimer}`;
  }
  
  return `${dataPrefix}**Investing Basics**

Investing means putting your money to work to generate returns over time.

**Why Invest?**
• Beat inflation (savings lose value over time)
• Build wealth for future goals
• Achieve financial independence
• Retirement planning

**Investment Options:**
• **Stocks:** High risk, high return (10-15%+ per year)
• **Mutual Funds:** Diversified, managed (8-12% per year)
• **Fixed Deposits:** Safe, low return (5-7% per year)
• **Real Estate:** Long-term, illiquid (8-10% per year)
• **Gold:** Hedge against inflation (6-8% per year)

**Golden Rules:**
1. **Start early** - Time is your biggest advantage
2. **Diversify** - Don't put all eggs in one basket
3. **Stay invested** - Don't panic sell in downturns
4. **Invest regularly** - SIP is better than timing market
5. **Match risk to goals** - Long-term = equity, short-term = debt

**Beginner's Path:**
1. Build emergency fund first (3-6 months expenses)
2. Start SIP in diversified mutual fund (₹1,000-5,000/month)
3. Increase investment as income grows
4. Stay invested for 5+ years

Would you like to know more about SIPs, mutual funds, or stock market basics?${disclaimer}`;
}

// Generate response for stock market queries
function generateStocksResponse(query: string, context: AssistantContext): string {
  const dataPrefix = generateDataAwarePrefix(context);
  const disclaimer = '\n\n**⚠️ Important Disclaimer:** This is educational information only, not financial advice. Stock market investing involves significant risk. Consult a certified financial advisor before making investment decisions.';
  
  return `${dataPrefix}**Stock Market Basics**

**What Are Stocks?**
Stocks (or shares) represent ownership in a company. When you buy a stock, you own a small piece of that company.

**How Stock Markets Work:**
• Companies list their shares on stock exchanges (BSE, NSE in India)
• Investors buy and sell shares through brokers
• Prices change based on supply and demand
• You profit when you sell at a higher price than you bought

**Why Stock Prices Change:**
• Company performance (profits, growth)
• Economic conditions
• Industry trends
• Investor sentiment
• News and events

**Types of Stocks:**
• **Blue-chip:** Large, stable companies (lower risk)
• **Growth:** Fast-growing companies (higher risk/reward)
• **Dividend:** Pay regular income (stable returns)
• **Small-cap:** Smaller companies (highest risk/reward)

**How to Start:**
1. Open demat and trading account
2. Complete KYC
3. Research companies
4. Start with small amounts
5. Diversify across sectors

**Key Concepts:**
• **Diversification:** Spread risk across multiple stocks
• **Long-term investing:** Hold for 5+ years
• **Fundamental analysis:** Study company financials
• **Technical analysis:** Study price patterns

**Risks:**
• Market volatility
• Company-specific risks
• No guaranteed returns
• Requires research and monitoring

**Beginner Tips:**
• Start with mutual funds before individual stocks
• Invest only money you can afford to lose
• Don't follow tips blindly
• Learn continuously
• Stay patient and disciplined

**Pro Tip:** For beginners, index funds or diversified equity mutual funds are safer than picking individual stocks!${disclaimer}`;
}

export function generateDeterministicResponse(query: string, context: AssistantContext): AssistantResponse {
  // Check for no data fallback
  if (!context.hasData) {
    const category = classifyQuery(query);
    let response = '';
    
    if (category === 'saving' || category === 'expenses' || category === 'budgeting') {
      response = `**I'd love to give you personalized advice!**

However, I don't see any financial data in your account yet. To provide recommendations based on your actual spending patterns and goals:

**Add Your Data:**
1. **Transactions:** Go to the Transactions page and add your income and expenses
2. **Goals:** Visit the Goals page to set your savings targets
3. **Come back here:** Once you have some data, I can give you specific advice!

**In the meantime, here's general advice:**\n\n`;
      
      // Add general advice based on category
      if (category === 'saving') {
        response += generateSavingResponse(query, context);
      } else if (category === 'expenses') {
        response += generateExpenseControlResponse(query, context);
      } else {
        response += generateBudgetingResponse(query, context);
      }
      
      return {
        content: response,
        needsClarification: false,
        disclaimer: 'Educational purposes only. Not financial advice.',
      };
    }
  }
  
  // Check for vague queries
  if (isVagueQuery(query)) {
    return {
      content: generateClarifyingQuestions(query),
      needsClarification: true,
    };
  }

  const category = classifyQuery(query);
  let response = '';

  switch (category) {
    case 'budgeting':
      response = generateBudgetingResponse(query, context);
      break;
    case 'saving':
      response = generateSavingResponse(query, context);
      break;
    case 'expenses':
      response = generateExpenseControlResponse(query, context);
      break;
    case 'investing':
      response = generateInvestingResponse(query, context);
      break;
    case 'stocks':
      response = generateStocksResponse(query, context);
      break;
    default:
      response = `I can help you with:

• **Budgeting** - Creating budgets, tracking expenses, 50/30/20 rule
• **Saving** - Emergency funds, saving strategies, tips for tight budgets
• **Investing** - SIPs, mutual funds, investment basics
• **Stocks** - Stock market basics, how to start investing
• **Expense Control** - Reducing spending, cutting costs

What would you like to know more about?`;
  }

  return {
    content: response,
    needsClarification: false,
    disclaimer: category === 'investing' || category === 'stocks' 
      ? 'Educational purposes only. Not financial advice. Consult a certified financial advisor before investing.'
      : 'Educational purposes only. Not financial advice.',
  };
}
