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
  if (lowerQuery.match(/\b(expense|cost|reduce|cut|lower)/)) {
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

// Generate response for budgeting queries
function generateBudgetingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('50/30/20') || lowerQuery.includes('rule')) {
    return `**The 50/30/20 Budgeting Rule**

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
    return `**How to Create a Monthly Budget (Step-by-Step)**

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
    return `**Best Ways to Track Your Expenses**

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
  
  return `**Budgeting Basics**

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
  
  if (lowerQuery.includes('emergency fund')) {
    return `**Building an Emergency Fund**

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
    return `**How Much Should You Save Each Month?**

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
    return `**Saving Money on a Tight Budget**

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
  
  return `**Smart Saving Strategies**

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

// Generate response for investing queries
function generateInvestingResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('sip')) {
    return `**SIP (Systematic Investment Plan) Explained**

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

**Pro Tip:** Start small (₹1,000-2,000) and increase by 10% every year as your income grows!`;
  }
  
  if (lowerQuery.includes('mutual fund')) {
    return `**Mutual Funds Explained Simply**

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

**Pro Tip:** For beginners, start with a diversified equity fund via SIP. Stay invested for at least 5 years to see good returns!`;
  }
  
  return `**Investing Basics**

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

Would you like to know more about SIPs, mutual funds, or stock market basics?`;
}

// Generate response for stock market queries
function generateStocksResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('what are') || lowerQuery.includes('basics')) {
    return `**Stock Market Basics**

**What Are Stocks?**
Stocks (or shares) represent ownership in a company. When you buy a stock, you own a small piece of that company.

**How Stock Markets Work:**
• Companies list their shares on stock exchanges (BSE, NSE in India)
• Investors buy and sell shares through brokers
• Prices change based on supply and demand
• You profit when you sell at a higher price than you bought

**Key Concepts:**

**1. Stock Price**
• Determined by what buyers are willing to pay
• Influenced by company performance, news, economy
• Can be volatile (change rapidly)

**2. Market Indices**
• **Sensex:** Top 30 companies on BSE
• **Nifty 50:** Top 50 companies on NSE
• Show overall market performance

**3. Bull vs Bear Market**
• **Bull Market:** Prices rising, optimism high
• **Bear Market:** Prices falling, pessimism high

**4. Dividends**
• Portion of company profits paid to shareholders
• Extra income beyond stock price gains
• Not all companies pay dividends

**Types of Stocks:**
• **Large-cap:** Big, stable companies (lower risk)
• **Mid-cap:** Medium-sized, growing companies
• **Small-cap:** Small companies (higher risk, higher potential)

**How to Make Money:**
1. **Capital Gains:** Buy low, sell high
2. **Dividends:** Regular income from company profits

**Risks:**
• Stock prices can fall (you may lose money)
• Company can go bankrupt
• Market volatility (prices swing wildly)
• No guaranteed returns

**How to Start:**
1. Open demat and trading account with broker
2. Complete KYC
3. Research companies or invest via mutual funds
4. Start small, learn as you go
5. Diversify (don't buy just one stock)

**Beginner Tip:** Instead of picking individual stocks, start with index funds or diversified equity mutual funds. They're less risky and easier to manage!`;
  }
  
  if (lowerQuery.includes('start') || lowerQuery.includes('begin')) {
    return `**How to Start Investing in Stocks**

**Step 1: Learn the Basics**
• Understand what stocks are
• Learn about risk and returns
• Study market indices (Sensex, Nifty)
• Read about successful investors

**Step 2: Set Your Goals**
• Why are you investing? (retirement, wealth, income)
• Time horizon (5 years, 10 years, 20 years)
• Risk tolerance (how much loss can you handle?)

**Step 3: Open Trading Account**
• Choose a broker (Zerodha, Groww, Upstox, etc.)
• Complete KYC (Aadhaar, PAN, bank details)
• Open demat account (holds your shares)
• Open trading account (to buy/sell)

**Step 4: Start Small**
• Begin with ₹5,000-10,000
• Don't invest money you need soon
• Use only surplus funds

**Step 5: Choose Your Approach**

**Option A: Direct Stock Picking**
• Research companies thoroughly
• Check financial statements
• Understand the business
• Higher risk, requires time and knowledge

**Option B: Mutual Funds/ETFs (Recommended for Beginners)**
• Invest in index funds (track Nifty/Sensex)
• Diversified equity mutual funds
• Lower risk, professionally managed
• Start with SIP

**Step 6: Diversify**
• Don't put all money in one stock
• Spread across sectors (IT, banking, pharma, etc.)
• Mix large-cap, mid-cap, small-cap
• Include some debt for stability

**Step 7: Invest Regularly**
• Use SIP for mutual funds
• Or invest fixed amount monthly in stocks
• Rupee cost averaging reduces risk

**Step 8: Stay Informed**
• Read financial news
• Track your investments monthly (not daily!)
• Learn from mistakes
• Adjust strategy as needed

**Common Mistakes to Avoid:**
❌ Investing borrowed money
❌ Following tips blindly
❌ Panic selling in downturns
❌ Putting all money in one stock
❌ Checking prices every hour

**Beginner-Friendly Strategy:**
1. Start with index fund SIP (₹2,000-5,000/month)
2. After 6 months, add 2-3 large-cap stocks
3. Gradually increase investment as you learn
4. Stay invested for 5+ years

**Pro Tip:** The best time to start was yesterday. The second-best time is today. Start small, learn continuously, and stay patient!`;
  }
  
  if (lowerQuery.includes('diversif')) {
    return `**Diversification in Investing**

**What Is Diversification?**
"Don't put all your eggs in one basket" - Spread your investments across different assets to reduce risk.

**Why Diversify?**
• If one investment fails, others may succeed
• Reduces overall portfolio risk
• Smoother returns over time
• Better sleep at night!

**How to Diversify:**

**1. Across Asset Classes**
• **Stocks (Equity):** 50-70% (high growth)
• **Bonds (Debt):** 20-30% (stability)
• **Gold:** 5-10% (hedge against inflation)
• **Real Estate:** 10-20% (long-term)

**2. Across Sectors**
• IT & Technology
• Banking & Finance
• Healthcare & Pharma
• Consumer Goods
• Energy & Utilities
• Manufacturing

**3. Across Company Sizes**
• **Large-cap:** 50-60% (stable, lower risk)
• **Mid-cap:** 25-35% (growth potential)
• **Small-cap:** 10-15% (high risk, high reward)

**4. Across Geographies**
• Indian stocks
• International stocks (US, Europe, Asia)
• Emerging markets

**5. Across Investment Styles**
• Growth stocks (high potential)
• Value stocks (undervalued)
• Dividend stocks (regular income)

**Example Diversified Portfolio (₹1,00,000):**
• Large-cap stocks: ₹30,000
• Mid-cap stocks: ₹15,000
• Small-cap stocks: ₹5,000
• Equity mutual funds: ₹20,000
• Debt mutual funds: ₹15,000
• Gold: ₹10,000
• Emergency fund (liquid): ₹5,000

**Easy Way to Diversify:**
• Invest in index funds (automatically diversified)
• Diversified equity mutual funds
• Balanced/hybrid funds

**How Much Diversification?**
• **Too little:** High risk (all in one stock)
• **Too much:** Diluted returns (100 stocks)
• **Just right:** 10-20 stocks or 3-5 mutual funds

**Rebalancing:**
• Review portfolio every 6-12 months
• Sell overperformers, buy underperformers
• Maintain target allocation

**Pro Tip:** For beginners, a single diversified equity mutual fund or index fund provides instant diversification across 50-100 stocks!`;
  }
  
  return `**Stock Market Overview**

The stock market is where shares of public companies are bought and sold.

**Key Points:**
• Represents ownership in companies
• Prices fluctuate based on supply/demand
• Long-term returns average 10-15% per year
• Short-term volatility is normal

**How to Invest:**
• **Direct stocks:** Buy individual company shares
• **Mutual funds:** Professional management, diversified
• **Index funds:** Track market indices (Nifty, Sensex)
• **ETFs:** Trade like stocks, diversified like funds

**Important Principles:**
• Invest for long-term (5+ years)
• Diversify across sectors and companies
• Don't try to time the market
• Stay invested through ups and downs
• Invest only surplus money

**Risks:**
• Market volatility
• Company-specific risks
• Economic downturns
• No guaranteed returns

Would you like to know more about how stocks work, how to start investing, or diversification strategies?`;
}

// Generate response for expense reduction queries
function generateExpenseResponse(query: string, context: AssistantContext): string {
  const lowerQuery = query.toLowerCase();
  
  return `**How to Reduce Your Expenses**

**Quick Wins (Immediate Savings):**

**1. Subscriptions & Memberships**
• Cancel unused streaming services
• Downgrade phone/internet plans
• Cancel gym membership (use free workouts)
• Review all recurring charges
• **Potential savings: ₹1,000-3,000/month**

**2. Food & Dining**
• Cook at home instead of ordering
• Pack lunch for work
• Reduce eating out by 50%
• Buy groceries in bulk
• Use meal planning
• **Potential savings: ₹3,000-5,000/month**

**3. Transportation**
• Use public transport
• Carpool with colleagues
• Bike or walk for short distances
• Combine errands to save fuel
• **Potential savings: ₹1,500-3,000/month**

**4. Utilities**
• Turn off lights/AC when not needed
• Use energy-efficient appliances
• Fix water leaks
• Unplug devices when not in use
• **Potential savings: ₹500-1,500/month**

**5. Shopping**
• Wait 24 hours before buying
• Use cashback and discount apps
• Buy generic brands
• Shop during sales
• Avoid impulse purchases
• **Potential savings: ₹2,000-4,000/month**

**Medium-Term Changes:**

**6. Housing**
• Get a roommate
• Move to cheaper area
• Negotiate rent
• **Potential savings: ₹3,000-10,000/month**

**7. Insurance**
• Compare and switch providers
• Bundle policies for discounts
• Increase deductibles
• **Potential savings: ₹500-2,000/month**

**8. Entertainment**
• Free activities (parks, libraries, community events)
• Share subscriptions with family
• Host potlucks instead of restaurants
• **Potential savings: ₹1,000-2,000/month**

**9. Personal Care**
• Cut hair less frequently
• DIY beauty treatments
• Buy products in bulk
• **Potential savings: ₹500-1,500/month**

**10. Debt Payments**
• Refinance high-interest loans
• Pay off credit cards (avoid interest)
• Consolidate debts
• **Potential savings: ₹1,000-5,000/month**

**The 30-Day Challenge:**
• Track every expense for 30 days
• Identify your top 5 expense categories
• Cut each by 10-20%
• Redirect savings to emergency fund

**Expenses You Should NOT Cut:**
✅ Health insurance
✅ Emergency fund contributions
✅ Necessary medications
✅ Basic nutrition
✅ Essential transportation

**Pro Tip:** Start with the easiest cuts first (subscriptions, eating out). Once you see savings, you'll be motivated to tackle bigger expenses!

**Total Potential Monthly Savings: ₹10,000-30,000**

Would you like specific advice on reducing expenses in a particular category?`;
}

// Main function to generate deterministic response
export function generateDeterministicResponse(
  query: string,
  context: AssistantContext
): AssistantResponse {
  // Check for vague queries first
  if (isVagueQuery(query)) {
    return {
      content: generateClarifyingQuestions(query),
      needsClarification: true,
    };
  }

  // Classify and route to appropriate handler
  const category = classifyQuery(query);
  let content: string;
  let disclaimer: string | undefined;

  switch (category) {
    case 'budgeting':
      content = generateBudgetingResponse(query, context);
      break;
    case 'saving':
      content = generateSavingResponse(query, context);
      break;
    case 'investing':
      content = generateInvestingResponse(query, context);
      disclaimer = 'For learning purposes only. This is educational information, not financial advice. Always consult a qualified financial advisor before making investment decisions.';
      break;
    case 'stocks':
      content = generateStocksResponse(query, context);
      disclaimer = 'For learning purposes only. This is educational information, not financial advice. Stock market investments carry risk. Always consult a qualified financial advisor before making investment decisions.';
      break;
    case 'expenses':
      content = generateExpenseResponse(query, context);
      break;
    default:
      content = `I can help you with:

**Budgeting & Planning:**
• Creating monthly budgets
• Tracking expenses
• 50/30/20 rule and other methods

**Saving Money:**
• Building emergency funds
• Saving strategies
• Reducing expenses

**Investing:**
• SIP investments
• Mutual funds
• Stock market basics
• Diversification

**Expense Management:**
• Cutting unnecessary costs
• Smart shopping tips
• Reducing bills

What would you like to learn about?`;
  }

  return {
    content,
    needsClarification: false,
    disclaimer,
  };
}
