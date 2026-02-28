// Static Problem→Solution finance blogs (15 entries)
// These are displayed directly on the /blog page without backend storage

export interface StaticBlog {
  id: string;
  title: string;
  problem: string;
  solution: string;
}

export const staticProblemSolutionBlogs: StaticBlog[] = [
  {
    id: "1",
    title: "People Earn Money but Still Live Paycheck to Paycheck",
    problem: "People Earn Money but Still Live Paycheck to Paycheck",
    solution: "Create a simple 50-30-20 budget rule. Track monthly expenses, cut unnecessary subscriptions, and automate savings first. Financial stability starts with awareness, not income level."
  },
  {
    id: "2",
    title: "No Emergency Fund During Financial Crisis",
    problem: "No Emergency Fund During Financial Crisis",
    solution: "Start with a small goal of ₹1,000–₹5,000. Save consistently until you reach 3–6 months of expenses. Keep this fund in a liquid account for quick access."
  },
  {
    id: "3",
    title: "Fear of Investing Due to Market Volatility",
    problem: "Fear of Investing Due to Market Volatility",
    solution: "Use Systematic Investment Plans (SIP). Investing small amounts regularly reduces risk and removes emotional decision-making from market ups and downs."
  },
  {
    id: "4",
    title: "Credit Card Debt Growing Every Month",
    problem: "Credit Card Debt Growing Every Month",
    solution: "Stop minimum payments. Use the debt snowball method—pay off the smallest balance first while maintaining minimums on others. This builds momentum and control."
  },
  {
    id: "5",
    title: "Lack of Financial Knowledge Among Young Adults",
    problem: "Lack of Financial Knowledge Among Young Adults",
    solution: "Start with basics: savings, insurance, and compounding. Follow reliable finance blogs, podcasts, and free online courses instead of risky shortcuts."
  },
  {
    id: "6",
    title: "Saving Money Feels Impossible on a Low Income",
    problem: "Saving Money Feels Impossible on a Low Income",
    solution: "Micro-saving works. Save spare change, round up expenses, or save ₹10–₹20 daily. Consistency matters more than amount."
  },
  {
    id: "7",
    title: "Dependence on a Single Source of Income",
    problem: "Dependence on a Single Source of Income",
    solution: "Develop a secondary income like freelancing, online tutoring, or digital products. Multiple income streams reduce financial stress and risk."
  },
  {
    id: "8",
    title: "Ignoring Retirement Planning Until Too Late",
    problem: "Ignoring Retirement Planning Until Too Late",
    solution: "Start early with small monthly investments. Compounding rewards time more than money. Even modest contributions grow significantly over decades."
  },
  {
    id: "9",
    title: "Poor Spending Habits Due to Emotional Purchases",
    problem: "Poor Spending Habits Due to Emotional Purchases",
    solution: "Follow the 24-hour rule before buying non-essential items. Delaying purchases reduces impulsive spending and improves financial discipline."
  },
  {
    id: "10",
    title: "Not Understanding Where Money Actually Goes",
    problem: "Not Understanding Where Money Actually Goes",
    solution: "Track expenses for 30 days using a simple app or spreadsheet. Awareness alone often reduces unnecessary spending by 20–30%."
  },
  {
    id: "11",
    title: "Confusion Between Saving and Investing",
    problem: "Confusion Between Saving and Investing",
    solution: "Savings protect money, investing grows money. Use savings for short-term needs and investing for long-term wealth creation."
  },
  {
    id: "12",
    title: "Financial Goals Feel Overwhelming",
    problem: "Financial Goals Feel Overwhelming",
    solution: "Break big goals into small milestones. Instead of \"buy a house,\" start with \"save for down payment.\" Progress creates motivation."
  },
  {
    id: "13",
    title: "Lack of Insurance Leads to Financial Loss",
    problem: "Lack of Insurance Leads to Financial Loss",
    solution: "Buy health and term insurance early. Insurance protects wealth and prevents debt during emergencies, making it a financial foundation, not an expense."
  },
  {
    id: "14",
    title: "High Expenses Without Lifestyle Satisfaction",
    problem: "High Expenses Without Lifestyle Satisfaction",
    solution: "Practice value-based spending. Spend more on what truly matters and cut costs on things that don't add real happiness."
  },
  {
    id: "15",
    title: "Financial Stress Affecting Mental Health",
    problem: "Financial Stress Affecting Mental Health",
    solution: "Create a clear money plan, seek professional advice if needed, and focus on gradual improvement. Financial peace is built step by step."
  }
];
