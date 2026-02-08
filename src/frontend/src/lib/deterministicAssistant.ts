// Deterministic AI assistant engine for finance queries
// Generates structured responses without external LLM/API calls

interface AssistantContext {
  balance?: number;
  recentTransactions?: Array<{ amount: number; category: string; transactionType: string }>;
  totalTransactions?: number;
}

interface AssistantResponse {
  content: string;
  needsClarification: boolean;
  disclaimer?: string;
}

type QueryCategory = 'stocks' | 'investing' | 'budgeting' | 'saving' | 'general';

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
• "What's the 50/30/20 rule?"
• "How can I track my expenses better?"

**Saving & Investing:**
• "How much should I save each month?"
• "What's the difference between SIP and lump sum investing?"
• "How do I start investing with ₹5,000?"

**Stocks & Markets:**
• "What are stocks and how do they work?"
• "How do I analyze a company before investing?"
• "What's portfolio diversification?"

Please ask a specific question and I'll provide detailed guidance!`;
}

// Generate structured response for stocks/investing
function generateStocksResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('what') && lowerQuery.includes('stock')) {
    return `**Understanding Stocks:**

**What are stocks?**
Stocks (or shares) represent ownership in a company. When you buy a stock, you become a partial owner of that business.

**Key Concepts:**
• **Share Price:** The current market value of one share
• **Market Cap:** Total value of all shares (Price × Total Shares)
• **Dividend:** Profit distribution to shareholders
• **Capital Gains:** Profit from selling shares at higher price

**How to Start:**
1. Open a Demat account with a registered broker
2. Complete KYC verification
3. Research companies using fundamental analysis
4. Start with blue-chip stocks (established companies)
5. Diversify across sectors

**Risk Management:**
• Never invest money you can't afford to lose
• Diversify your portfolio (don't put all eggs in one basket)
• Invest for long-term (5+ years)
• Review your portfolio quarterly

**Example:**
If you invest ₹10,000 in a stock at ₹100/share, you own 100 shares. If the price rises to ₹120, your investment is worth ₹12,000 (20% gain).`;
  }
  
  if (lowerQuery.includes('diversif')) {
    return `**Portfolio Diversification Strategy:**

**What is Diversification?**
Spreading investments across different assets to reduce risk. "Don't put all your eggs in one basket."

**Diversification Framework:**

**1. Asset Classes (40-60% allocation):**
• Stocks/Equity: 40-60%
• Bonds/Debt: 20-30%
• Gold/Commodities: 5-10%
• Cash/Emergency Fund: 10-15%

**2. Sector Diversification:**
• Technology: 15-20%
• Banking/Finance: 15-20%
• Healthcare: 10-15%
• Consumer Goods: 10-15%
• Energy: 10-15%
• Others: 20-30%

**3. Geographic Diversification:**
• Domestic stocks: 70-80%
• International exposure: 20-30%

**4. Market Cap Mix:**
• Large-cap (stable): 50-60%
• Mid-cap (growth): 25-35%
• Small-cap (high risk): 10-15%

**Example Portfolio (₹1,00,000):**
• Large-cap stocks: ₹40,000
• Mid-cap stocks: ₹20,000
• Debt funds: ₹25,000
• Gold ETF: ₹10,000
• Emergency cash: ₹5,000

**Benefits:**
✓ Reduces overall portfolio risk
✓ Smooths out market volatility
✓ Captures growth across sectors
✓ Protects against sector-specific downturns`;
  }
  
  if (lowerQuery.includes('analyze') || lowerQuery.includes('research')) {
    return `**Stock Analysis Framework:**

**Fundamental Analysis (Company Health):**

**1. Financial Metrics:**
• **P/E Ratio:** Price-to-Earnings (compare with industry average)
• **ROE:** Return on Equity (>15% is good)
• **Debt-to-Equity:** Lower is better (<1 is ideal)
• **Profit Margin:** Higher indicates efficiency
• **Revenue Growth:** Consistent YoY growth

**2. Business Quality:**
• Competitive advantage (moat)
• Management quality and track record
• Industry position and market share
• Future growth prospects

**3. Valuation:**
• Is the stock overvalued or undervalued?
• Compare P/E with industry peers
• Check historical price trends

**Technical Analysis (Price Trends):**
• Support and resistance levels
• Moving averages (50-day, 200-day)
• Trading volume patterns
• Trend direction (uptrend/downtrend)

**Red Flags to Avoid:**
⚠️ Declining revenue for 3+ quarters
⚠️ High debt-to-equity ratio (>2)
⚠️ Frequent management changes
⚠️ Regulatory issues or lawsuits
⚠️ Negative cash flow

**Research Checklist:**
☐ Read annual reports and quarterly results
☐ Check credit ratings
☐ Analyze competitor performance
☐ Review analyst recommendations
☐ Understand the business model

**Example:**
Company A: P/E = 25, ROE = 18%, Debt/Equity = 0.5, Revenue growth = 15% YoY
→ Good fundamentals, reasonable valuation`;
  }
  
  // Default stocks response
  return `**Stock Market Basics:**

Stocks represent ownership in companies. When you invest in stocks, you're buying a piece of a business.

**Key Points:**
• **Long-term Focus:** Invest for 5+ years minimum
• **Research:** Understand the company before investing
• **Diversification:** Spread risk across multiple stocks
• **Risk Management:** Only invest surplus money
• **Regular Review:** Monitor portfolio quarterly

**Getting Started:**
1. Open a Demat account
2. Complete KYC verification
3. Start with index funds or blue-chip stocks
4. Invest regularly (SIP approach)
5. Learn continuously

**Resources:**
• NSE/BSE official websites for market data
• Company annual reports for fundamentals
• Financial news portals for updates
• Investment courses for education

Would you like specific guidance on any aspect of stock investing?`;
}

// Generate structured response for investing
function generateInvestingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('sip') || lowerQuery.includes('systematic')) {
    return `**Systematic Investment Plan (SIP) Guide:**

**What is SIP?**
A disciplined way to invest fixed amounts regularly (monthly/quarterly) in mutual funds, regardless of market conditions.

**How SIP Works:**
• You invest ₹X every month
• Units are purchased at current NAV (Net Asset Value)
• When market is down, you buy more units
• When market is up, you buy fewer units
• This averages out your purchase cost (Rupee Cost Averaging)

**SIP vs Lump Sum:**

**SIP Advantages:**
✓ Disciplined investing habit
✓ Reduces market timing risk
✓ Affordable (start with ₹500)
✓ Power of compounding
✓ Rupee cost averaging

**Lump Sum Advantages:**
✓ Immediate full exposure
✓ Better in rising markets
✓ Lower transaction costs

**SIP Strategy:**

**For Beginners (₹5,000/month):**
• Large-cap fund: ₹2,000
• Mid-cap fund: ₹1,500
• Debt fund: ₹1,000
• International fund: ₹500

**For Moderate Risk (₹10,000/month):**
• Equity funds: ₹6,000
• Hybrid funds: ₹2,500
• Debt funds: ₹1,500

**Example Calculation:**
Monthly SIP: ₹5,000
Duration: 10 years
Expected return: 12% p.a.
Total invested: ₹6,00,000
Estimated value: ₹11,61,695
Wealth created: ₹5,61,695

**Best Practices:**
• Start early (time is your friend)
• Increase SIP amount annually (step-up SIP)
• Stay invested for 5+ years
• Don't stop during market falls
• Review portfolio annually`;
  }
  
  if (lowerQuery.includes('mutual fund')) {
    return `**Mutual Funds Explained:**

**What are Mutual Funds?**
Pooled investment vehicles managed by professionals. Your money is combined with other investors and invested in stocks, bonds, or other securities.

**Types of Mutual Funds:**

**1. Equity Funds (High Risk, High Return):**
• Large-cap: Stable, established companies
• Mid-cap: Growing companies
• Small-cap: High growth potential, volatile
• Sectoral: Specific industry focus

**2. Debt Funds (Low Risk, Stable Return):**
• Liquid funds: Very short-term
• Short-duration: 1-3 years
• Long-duration: 3+ years
• Corporate bonds

**3. Hybrid Funds (Balanced):**
• Mix of equity and debt
• Moderate risk and return
• Good for conservative investors

**4. Index Funds:**
• Track market indices (Nifty 50, Sensex)
• Low expense ratio
• Passive management

**How to Choose:**

**Step 1: Define Goal**
• Retirement: Equity funds (long-term)
• Child education (5-10 years): Hybrid funds
• Emergency fund: Liquid funds

**Step 2: Risk Assessment**
• High risk tolerance: 70% equity, 30% debt
• Moderate: 50% equity, 50% debt
• Low: 30% equity, 70% debt

**Step 3: Check Performance**
• 3-year and 5-year returns
• Compare with benchmark
• Consistency over time

**Key Metrics:**
• **NAV:** Net Asset Value (price per unit)
• **Expense Ratio:** Annual fees (<1% is good)
• **AUM:** Assets Under Management (size of fund)
• **Exit Load:** Fee for early withdrawal

**Example Portfolio (₹50,000):**
• Large-cap fund: ₹20,000
• Mid-cap fund: ₹15,000
• Debt fund: ₹10,000
• International fund: ₹5,000`;
  }
  
  // Default investing response
  return `**Investment Planning Guide:**

**Investment Principles:**
1. **Start Early:** Time is your biggest advantage
2. **Diversify:** Spread risk across assets
3. **Stay Disciplined:** Invest regularly (SIP)
4. **Long-term Focus:** Minimum 5-year horizon
5. **Review Regularly:** Annual portfolio check

**Investment Options:**
• **Equity Mutual Funds:** High growth potential
• **Debt Funds:** Stable, lower risk
• **PPF/EPF:** Tax-saving, guaranteed returns
• **Fixed Deposits:** Safe, predictable
• **Gold:** Hedge against inflation

**Risk-Return Spectrum:**
High Risk → Stocks, Small-cap funds
Medium Risk → Balanced funds, Corporate bonds
Low Risk → Debt funds, FDs, PPF

**Beginner Strategy:**
• Emergency fund first (3-6 months expenses)
• Clear high-interest debt
• Start SIP in diversified equity fund
• Add debt funds for stability
• Increase investment as income grows

Would you like a personalized investment plan based on your goals?`;
}

// Generate structured response for budgeting
function generateBudgetingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('50/30/20') || lowerQuery.includes('rule')) {
    return `**The 50/30/20 Budgeting Rule:**

**Simple Framework for Financial Health:**

**50% - Needs (Essential Expenses):**
• Rent/EMI
• Utilities (electricity, water, internet)
• Groceries
• Transportation
• Insurance premiums
• Minimum debt payments

**30% - Wants (Lifestyle & Discretionary):**
• Dining out & entertainment
• Shopping (non-essential)
• Hobbies & subscriptions
• Vacations
• Gadgets & upgrades

**20% - Savings & Investments:**
• Emergency fund
• Retirement savings
• Investment SIPs
• Debt prepayment
• Financial goals

**Example (₹50,000 monthly income):**
• Needs: ₹25,000 (rent ₹12,000, groceries ₹6,000, utilities ₹3,000, transport ₹4,000)
• Wants: ₹15,000 (entertainment ₹5,000, dining ₹4,000, shopping ₹6,000)
• Savings: ₹10,000 (SIP ₹6,000, emergency fund ₹4,000)

**Adjustments:**
• High rent city? Try 60/20/20
• Aggressive saver? Try 50/20/30
• Debt payoff mode? Try 50/10/40

**Implementation Steps:**
1. Calculate your monthly income
2. List all expenses by category
3. Classify as needs/wants
4. Adjust spending to fit the ratio
5. Automate savings on salary day
6. Review monthly and adjust

${context.balance !== undefined ? `\n**Your Current Status:**\nBalance: ₹${context.balance.toFixed(2)}\n${context.balance > 0 ? '✓ You\'re on track! Keep saving.' : '⚠️ Focus on reducing expenses and building emergency fund.'}` : ''}`;
  }
  
  if (lowerQuery.includes('track') || lowerQuery.includes('expense')) {
    return `**Expense Tracking Strategy:**

**Why Track Expenses?**
• Identify spending leaks
• Make informed decisions
• Achieve financial goals faster
• Reduce unnecessary expenses

**Tracking Methods:**

**1. Category-Based Tracking:**
• Housing (rent, maintenance)
• Food (groceries, dining out)
• Transportation (fuel, public transport)
• Entertainment (movies, subscriptions)
• Healthcare (medicines, insurance)
• Personal care
• Miscellaneous

**2. Daily Tracking Routine:**
• Morning: Review yesterday's expenses
• Evening: Log today's spending
• Weekly: Analyze category totals
• Monthly: Compare with budget

**3. Tools & Apps:**
• FinanceWise AI (this app!)
• Spreadsheet templates
• Mobile expense trackers
• Bank statement analysis

**Expense Reduction Tips:**

**Quick Wins:**
• Cancel unused subscriptions
• Cook at home more often
• Use public transport
• Buy generic brands
• Negotiate bills (internet, insurance)

**Medium-term:**
• Reduce dining out frequency
• Plan grocery shopping (avoid impulse)
• Use cashback and rewards
• Buy in bulk for essentials

**Long-term:**
• Downsize housing if possible
• Refinance high-interest loans
• Build emergency fund to avoid debt
• Invest savings for growth

${context.totalTransactions ? `\n**Your Activity:**\nYou have ${context.totalTransactions} transactions recorded. ${context.totalTransactions > 20 ? 'Great tracking habit!' : 'Keep logging expenses daily for better insights.'}` : ''}

**Action Plan:**
1. Log every expense for 30 days
2. Identify top 3 spending categories
3. Set reduction targets (10-20%)
4. Implement changes
5. Track progress weekly`;
  }
  
  // Default budgeting response
  return `**Budgeting Fundamentals:**

**What is a Budget?**
A spending plan that helps you manage income and expenses to achieve financial goals.

**Steps to Create a Budget:**

**1. Calculate Income:**
• Salary (after tax)
• Side income
• Investment returns
• Other sources

**2. List Expenses:**
• Fixed (rent, EMI, insurance)
• Variable (groceries, fuel)
• Discretionary (entertainment, shopping)

**3. Set Priorities:**
• Essential needs first
• Savings second (pay yourself first!)
• Wants last

**4. Track & Adjust:**
• Monitor spending daily
• Review weekly
• Adjust monthly

**Budgeting Tips:**
✓ Use the 50/30/20 rule as starting point
✓ Automate savings on salary day
✓ Build emergency fund (3-6 months expenses)
✓ Review and adjust quarterly
✓ Be realistic, not restrictive

**Common Mistakes to Avoid:**
⚠️ Not tracking small expenses
⚠️ Forgetting annual expenses (insurance, subscriptions)
⚠️ Being too restrictive (leads to burnout)
⚠️ Not adjusting for life changes
⚠️ Ignoring irregular income

${context.recentTransactions && context.recentTransactions.length > 0 ? `\n**Your Recent Activity:**\nYou've logged ${context.recentTransactions.length} recent transactions. Keep it up!` : ''}

Start tracking your expenses today to build a realistic budget!`;
}

// Generate structured response for saving
function generateSavingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('emergency')) {
    return `**Emergency Fund Planning:**

**What is an Emergency Fund?**
A dedicated savings account for unexpected expenses like medical emergencies, job loss, or urgent repairs.

**How Much to Save:**

**Minimum Target:** 3-6 months of essential expenses

**Calculate Your Target:**
Monthly essentials:
• Rent/EMI: ₹_____
• Groceries: ₹_____
• Utilities: ₹_____
• Insurance: ₹_____
• Transport: ₹_____
• Healthcare: ₹_____
**Total:** ₹_____ × 6 months = **Emergency Fund Goal**

**Example:**
Monthly essentials: ₹25,000
Emergency fund target: ₹25,000 × 6 = ₹1,50,000

**Building Strategy:**

**Phase 1: Quick Start (₹10,000)**
• Save ₹2,000/month for 5 months
• Keep in savings account
• Covers minor emergencies

**Phase 2: Foundation (₹50,000)**
• Increase to ₹3,000/month
• Move to liquid fund (better returns)
• Covers moderate emergencies

**Phase 3: Full Protection (₹1,50,000+)**
• Maintain ₹5,000/month savings
• Split between liquid fund and FD
• Complete financial security

**Where to Keep Emergency Fund:**
• **Savings Account:** Instant access, low returns
• **Liquid Funds:** 1-day withdrawal, better returns
• **Fixed Deposits:** 7-day withdrawal, highest returns
• **Combination:** 50% liquid fund + 50% FD

**When to Use:**
✓ Medical emergencies
✓ Job loss
✓ Urgent home/vehicle repairs
✓ Family emergencies

**When NOT to Use:**
✗ Vacations
✗ Shopping
✗ Lifestyle upgrades
✗ Planned expenses

**Replenishment:**
After using emergency fund, rebuild it immediately with increased monthly savings until restored.

${context.balance !== undefined && context.balance > 0 ? `\n**Your Progress:**\nCurrent balance: ₹${context.balance.toFixed(2)}\n${context.balance >= 150000 ? '🎉 Excellent! You have a strong emergency fund.' : context.balance >= 50000 ? '👍 Good progress! Keep building.' : '💪 Start building your emergency fund today!'}` : ''}`;
  }
  
  // Default saving response
  return `**Smart Saving Strategies:**

**Saving Principles:**
1. **Pay Yourself First:** Save before spending
2. **Automate:** Set up automatic transfers
3. **Start Small:** Even ₹500/month matters
4. **Increase Gradually:** Raise savings with income
5. **Have Clear Goals:** Know what you're saving for

**Saving Goals Framework:**

**Short-term (0-2 years):**
• Emergency fund
• Vacation
• Gadget purchase
• Course fees
**Strategy:** Savings account, liquid funds

**Medium-term (2-5 years):**
• Down payment for house
• Car purchase
• Wedding expenses
• Higher education
**Strategy:** Debt funds, FDs, RDs

**Long-term (5+ years):**
• Retirement
• Child's education
• Financial independence
**Strategy:** Equity mutual funds, PPF, NPS

**Saving Hacks:**

**Immediate Actions:**
• Round up expenses (save the difference)
• 30-day rule for big purchases
• Cancel unused subscriptions
• Pack lunch 3 days/week
• Use public transport once a week

**Monthly Habits:**
• Review and cut one expense category
• Sell unused items
• Negotiate bills
• Use cashback offers
• Cook at home more

**Quarterly Reviews:**
• Increase SIP by 10%
• Redirect bonuses to savings
• Optimize insurance premiums
• Review and reduce subscriptions

**Savings Challenges:**
• 52-week challenge (save ₹100 week 1, ₹200 week 2...)
• No-spend weekends
• Cash-only week
• Meal prep month

**Example Plan (₹40,000 income):**
• Emergency fund: ₹3,000/month
• Retirement SIP: ₹3,000/month
• Goal-based saving: ₹2,000/month
• Total savings: ₹8,000/month (20%)

Start today - even small amounts compound into significant wealth over time!`;
}

// Main function to generate deterministic response
export function generateDeterministicResponse(
  query: string,
  context: AssistantContext = {}
): AssistantResponse {
  // Check for vague queries
  if (isVagueQuery(query)) {
    return {
      content: generateClarifyingQuestions(query),
      needsClarification: true,
    };
  }
  
  // Classify query
  const category = classifyQuery(query);
  
  // Generate response based on category
  let content: string;
  let disclaimer: string | undefined;
  
  switch (category) {
    case 'stocks':
      content = generateStocksResponse(query, context);
      disclaimer = '⚠️ **Educational Purpose Only:** This information is for learning, not financial advice. Stock markets involve risk. Consult a SEBI-registered financial advisor before investing. Past performance doesn\'t guarantee future returns.';
      break;
      
    case 'investing':
      content = generateInvestingResponse(query, context);
      disclaimer = '⚠️ **Educational Purpose Only:** This information is for learning, not financial advice. Investments are subject to market risks. Read all scheme documents carefully. Consult a certified financial planner before making investment decisions.';
      break;
      
    case 'budgeting':
      content = generateBudgetingResponse(query, context);
      break;
      
    case 'saving':
      content = generateSavingResponse(query, context);
      break;
      
    default:
      content = `**Financial Guidance:**

I can help you with:

**📊 Budgeting & Planning:**
• Creating monthly budgets
• Tracking expenses
• 50/30/20 rule
• Reducing spending

**💰 Saving Strategies:**
• Emergency fund planning
• Goal-based saving
• Saving challenges
• Automated savings

**📈 Investing Basics:**
• SIP vs lump sum
• Mutual funds explained
• Asset allocation
• Risk management

**📉 Stock Market:**
• Stock basics
• Portfolio diversification
• Company analysis
• Market concepts

**🌐 Web Resources:**
• NSE/BSE for market data
• Moneycontrol for news
• Value Research for mutual funds
• ET Money for planning

Please ask a specific question about any of these topics!`;
  }
  
  return {
    content,
    needsClarification: false,
    disclaimer,
  };
}
