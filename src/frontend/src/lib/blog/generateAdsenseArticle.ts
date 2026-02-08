// Deterministic blog article generator for AdSense-friendly content
// Generates ~1200-word problem-solving articles from post metadata

interface ArticleMetadata {
  title: string;
  slug: string;
  keywords?: string[];
}

interface GeneratedArticle {
  htmlContent: string;
  excerpt: string;
  wordCount: number;
}

// Generate deterministic article content
export function generateAdsenseArticle(metadata: ArticleMetadata): GeneratedArticle {
  const { title, slug } = metadata;
  
  // Extract topic from title/slug
  const topic = extractTopic(slug, title);
  
  // Generate structured article sections
  const sections = generateArticleSections(topic, title);
  
  // Build HTML content
  const htmlContent = buildHtmlContent(title, sections);
  
  // Generate excerpt
  const excerpt = generateExcerpt(sections.introduction);
  
  // Count words
  const wordCount = countWords(htmlContent);
  
  return {
    htmlContent,
    excerpt,
    wordCount,
  };
}

// Extract topic from slug or title
function extractTopic(slug: string, title: string): string {
  // Common financial topics
  const topics: Record<string, string> = {
    'budget': 'budgeting',
    'emergency': 'emergency fund',
    'credit': 'credit score',
    'sip': 'SIP investing',
    'debt': 'debt management',
    'tax': 'tax planning',
    'retirement': 'retirement planning',
    'psychology': 'money psychology',
    'mutual': 'mutual funds',
    'insurance': 'insurance',
    'side-hustle': 'side income',
    'stock': 'stock market',
    'goal': 'financial goals',
    'mistake': 'financial mistakes',
    'wealth': 'wealth building',
  };
  
  const lowerSlug = slug.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  for (const [key, value] of Object.entries(topics)) {
    if (lowerSlug.includes(key) || lowerTitle.includes(key)) {
      return value;
    }
  }
  
  return 'personal finance';
}

// Generate article sections
function generateArticleSections(topic: string, title: string) {
  return {
    introduction: generateIntroduction(topic, title),
    problemStatement: generateProblemStatement(topic),
    causes: generateCauses(topic),
    stepByStep: generateStepByStep(topic),
    examples: generateExamples(topic),
    checklist: generateChecklist(topic),
    faqs: generateFAQs(topic),
    conclusion: generateConclusion(topic),
  };
}

// Generate introduction
function generateIntroduction(topic: string, title: string): string {
  return `Understanding ${topic} is crucial for achieving financial stability and long-term wealth. Many people struggle with ${topic} due to lack of proper guidance and practical strategies. This comprehensive guide will walk you through everything you need to know about ${topic}, providing actionable steps and real-world examples to help you succeed.

Whether you're just starting your financial journey or looking to optimize your existing approach, this article covers essential concepts, common pitfalls, and proven strategies that work. By the end of this guide, you'll have a clear roadmap to master ${topic} and take control of your financial future.`;
}

// Generate problem statement
function generateProblemStatement(topic: string): string {
  const problems: Record<string, string> = {
    'budgeting': 'Many individuals find it challenging to track their expenses and stick to a budget. Without a clear spending plan, money seems to disappear, leaving little room for savings or investments. The lack of financial discipline leads to stress, debt accumulation, and missed opportunities for wealth building.',
    'emergency fund': 'Most people live paycheck to paycheck without any financial cushion for emergencies. When unexpected expenses arise—medical bills, car repairs, or job loss—they resort to high-interest loans or credit cards, creating a debt spiral that\'s hard to escape.',
    'credit score': 'A poor credit score can significantly impact your financial life, making it difficult to secure loans, rent apartments, or even get certain jobs. Many people don\'t understand how credit scores work or what actions damage their creditworthiness.',
    'SIP investing': 'Investing can seem intimidating, especially for beginners. Many people delay investing due to fear of market volatility or lack of knowledge about where to start. This delay costs them years of potential compound growth.',
    'debt management': 'Debt can feel overwhelming and never-ending. High-interest loans, credit card balances, and multiple EMIs drain your income, leaving little for savings or investments. Without a strategic approach, debt continues to grow.',
    'default': `Managing ${topic} effectively is a common challenge faced by many individuals. Without proper knowledge and strategy, people make costly mistakes that set back their financial progress by years.`,
  };
  
  return problems[topic] || problems['default'];
}

// Generate causes
function generateCauses(topic: string): string {
  return `<h3>Common Causes of ${topic.charAt(0).toUpperCase() + topic.slice(1)} Problems</h3>
<ul>
<li><strong>Lack of Financial Education:</strong> Most people never receive formal education about personal finance, leading to poor money management habits.</li>
<li><strong>Lifestyle Inflation:</strong> As income increases, spending increases proportionally or even faster, leaving no room for savings or investments.</li>
<li><strong>Impulse Spending:</strong> Emotional purchases and lack of spending discipline drain financial resources without providing lasting value.</li>
<li><strong>No Clear Goals:</strong> Without specific financial goals, it's easy to drift and make short-term decisions that harm long-term wealth.</li>
<li><strong>Procrastination:</strong> Delaying important financial decisions like starting investments or building emergency funds costs valuable time and compound growth.</li>
<li><strong>Following the Crowd:</strong> Making financial decisions based on what others do rather than personal circumstances and goals.</li>
</ul>`;
}

// Generate step-by-step solution
function generateStepByStep(topic: string): string {
  const steps: Record<string, string[]> = {
    'budgeting': [
      'Calculate Your Total Monthly Income: Include salary, side income, and any other regular earnings after taxes.',
      'List All Expenses: Track every expense for 30 days to understand your spending patterns. Categorize into needs, wants, and savings.',
      'Apply the 50/30/20 Rule: Allocate 50% to needs, 30% to wants, and 20% to savings and investments. Adjust based on your situation.',
      'Set Up Automatic Transfers: Automate savings on salary day to ensure you pay yourself first before spending.',
      'Use Budgeting Tools: Leverage apps like FinanceWise AI to track expenses in real-time and get insights.',
      'Review and Adjust Monthly: Analyze your spending patterns and make necessary adjustments to stay on track.',
      'Build Emergency Fund: Prioritize saving 3-6 months of expenses before aggressive investing.',
      'Cut Unnecessary Expenses: Identify and eliminate subscriptions, memberships, or habits that don\'t add value.',
    ],
    'emergency fund': [
      'Set Your Target Amount: Calculate 3-6 months of essential expenses (rent, food, utilities, insurance).',
      'Start Small: Begin with a mini-goal of ₹10,000-25,000 for minor emergencies.',
      'Open a Separate Account: Keep emergency funds separate from regular savings to avoid temptation.',
      'Automate Monthly Contributions: Set up automatic transfers of 10-20% of income to emergency fund.',
      'Use Windfalls Wisely: Direct bonuses, tax refunds, or gifts toward emergency fund.',
      'Choose the Right Account: Use liquid funds or high-yield savings accounts for better returns with easy access.',
      'Replenish After Use: If you use emergency funds, make rebuilding them your top priority.',
      'Don\'t Touch for Non-Emergencies: Resist using emergency funds for vacations, shopping, or planned expenses.',
    ],
    'default': [
      'Assess Your Current Situation: Understand where you stand financially by reviewing income, expenses, assets, and liabilities.',
      'Set Clear Goals: Define specific, measurable, achievable, relevant, and time-bound (SMART) financial goals.',
      'Create an Action Plan: Break down your goals into actionable steps with deadlines.',
      'Educate Yourself: Read books, take courses, and follow reliable financial resources to improve your knowledge.',
      'Start Small: Begin with manageable changes and gradually increase your efforts as you build confidence.',
      'Track Progress: Monitor your progress regularly and celebrate small wins to stay motivated.',
      'Seek Professional Help: Consult certified financial planners for personalized guidance on complex matters.',
      'Stay Consistent: Financial success requires discipline and consistency over time, not quick fixes.',
    ],
  };
  
  const stepList = steps[topic] || steps['default'];
  
  let html = `<h3>Step-by-Step Solution</h3><ol>`;
  stepList.forEach(step => {
    html += `<li><strong>${step.split(':')[0]}:</strong> ${step.split(':').slice(1).join(':')}</li>`;
  });
  html += `</ol>`;
  
  return html;
}

// Generate examples
function generateExamples(topic: string): string {
  return `<h3>Real-World Examples</h3>
<div class="example-box">
<h4>Example 1: Young Professional</h4>
<p><strong>Situation:</strong> Priya, 26, earns ₹50,000/month but struggles to save due to lifestyle expenses.</p>
<p><strong>Solution:</strong> She implemented the 50/30/20 rule, automated ₹10,000 monthly savings, and cut unnecessary subscriptions worth ₹3,000/month.</p>
<p><strong>Result:</strong> Within 12 months, she built an emergency fund of ₹1,20,000 and started investing ₹5,000/month in mutual funds.</p>
</div>

<div class="example-box">
<h4>Example 2: Family with Debt</h4>
<p><strong>Situation:</strong> Rajesh and Meena had ₹5,00,000 in credit card and personal loan debt with 18% interest.</p>
<p><strong>Solution:</strong> They created a strict budget, used the debt avalanche method (paying high-interest debt first), and increased income through freelancing.</p>
<p><strong>Result:</strong> They became debt-free in 3 years and now invest ₹15,000/month toward retirement.</p>
</div>

<div class="example-box">
<h4>Example 3: Late Starter</h4>
<p><strong>Situation:</strong> Amit, 40, had no investments or retirement savings despite earning well.</p>
<p><strong>Solution:</strong> He started aggressive SIPs of ₹25,000/month in diversified equity funds and increased contributions annually by 10%.</p>
<p><strong>Result:</strong> With 20 years until retirement, he's on track to build a corpus of ₹2+ crores through disciplined investing.</p>
</div>`;
}

// Generate checklist
function generateChecklist(topic: string): string {
  return `<h3>Action Checklist</h3>
<p>Use this checklist to ensure you're on the right track:</p>
<ul class="checklist">
<li>☐ Calculated monthly income and expenses accurately</li>
<li>☐ Set specific financial goals with deadlines</li>
<li>☐ Created a realistic budget based on 50/30/20 rule</li>
<li>☐ Opened separate accounts for savings and emergency fund</li>
<li>☐ Automated monthly savings and investments</li>
<li>☐ Tracked expenses daily for at least 30 days</li>
<li>☐ Identified and eliminated unnecessary expenses</li>
<li>☐ Built emergency fund covering 3-6 months expenses</li>
<li>☐ Started investing in diversified mutual funds or stocks</li>
<li>☐ Reviewed and adjusted financial plan quarterly</li>
<li>☐ Educated myself through books, courses, or advisors</li>
<li>☐ Protected assets with adequate insurance coverage</li>
</ul>`;
}

// Generate FAQs
function generateFAQs(topic: string): string {
  return `<h3>Frequently Asked Questions</h3>

<h4>Q1: How long does it take to see results?</h4>
<p><strong>A:</strong> Financial improvements take time. You'll see initial results within 3-6 months of consistent effort, but significant wealth building requires 5-10 years of disciplined saving and investing.</p>

<h4>Q2: What if I have irregular income?</h4>
<p><strong>A:</strong> Base your budget on your minimum expected monthly income. Save extra earnings during good months to cover shortfalls during lean periods. Build a larger emergency fund (9-12 months) for added security.</p>

<h4>Q3: Should I pay off debt or invest first?</h4>
<p><strong>A:</strong> Pay off high-interest debt (>12% interest) first while building a small emergency fund (₹25,000-50,000). Once high-interest debt is cleared, balance between debt repayment and investing.</p>

<h4>Q4: How much should I save each month?</h4>
<p><strong>A:</strong> Aim for at least 20% of your income. If that's not possible initially, start with 10% and gradually increase. The key is consistency, not the amount.</p>

<h4>Q5: What if I'm already behind on my financial goals?</h4>
<p><strong>A:</strong> It's never too late to start. Focus on what you can control now: increase savings rate, reduce expenses, boost income through side hustles, and invest aggressively in growth assets.</p>

<h4>Q6: Do I need a financial advisor?</h4>
<p><strong>A:</strong> For basic financial planning, self-education is sufficient. However, for complex situations (tax planning, estate planning, large investments), consulting a SEBI-registered advisor is recommended.</p>`;
}

// Generate conclusion
function generateConclusion(topic: string): string {
  return `<h3>Conclusion</h3>
<p>Mastering ${topic} is a journey, not a destination. It requires consistent effort, discipline, and continuous learning. The strategies outlined in this guide provide a solid foundation, but remember that personal finance is personal—adapt these principles to your unique situation and goals.</p>

<p>Start today, even if it's with small steps. Track your expenses, create a budget, automate your savings, and educate yourself continuously. Financial freedom is achievable for anyone willing to make informed decisions and stay committed to their goals.</p>

<p>Remember these key takeaways:</p>
<ul>
<li>Start early and stay consistent</li>
<li>Automate savings and investments</li>
<li>Live below your means</li>
<li>Invest for the long term</li>
<li>Continuously educate yourself</li>
<li>Review and adjust regularly</li>
<li>Seek help when needed</li>
</ul>

<p><strong>Disclaimer:</strong> This article is for educational purposes only and does not constitute financial advice. Consult a certified financial planner for personalized guidance based on your specific circumstances.</p>`;
}

// Build HTML content
function buildHtmlContent(title: string, sections: any): string {
  return `
<article class="blog-article">
  <h2>${title}</h2>
  
  <div class="introduction">
    <p>${sections.introduction}</p>
  </div>
  
  <h3>The Problem</h3>
  <p>${sections.problemStatement}</p>
  
  ${sections.causes}
  
  ${sections.stepByStep}
  
  ${sections.examples}
  
  ${sections.checklist}
  
  ${sections.faqs}
  
  ${sections.conclusion}
</article>
  `.trim();
}

// Generate excerpt from introduction
function generateExcerpt(introduction: string): string {
  const sentences = introduction.split('. ');
  return sentences.slice(0, 2).join('. ') + '.';
}

// Count words in HTML content
function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(' ').length;
}
