export type BudgetModeKey = 'beginner' | 'student' | 'professional' | 'family' | 'aggressiveSaving';

export interface ModeAllocation {
  needs: number;
  wants: number;
  savings: number;
}

export const BUDGET_MODE_LABELS: Record<BudgetModeKey, string> = {
  beginner: 'Beginner',
  student: 'Student',
  professional: 'Professional',
  family: 'Family',
  aggressiveSaving: 'Aggressive Saving',
};

export const BUDGET_MODE_ALLOCATIONS: Record<BudgetModeKey, ModeAllocation> = {
  beginner: { needs: 70, wants: 20, savings: 10 },
  student: { needs: 70, wants: 20, savings: 10 },
  professional: { needs: 50, wants: 30, savings: 20 },
  family: { needs: 60, wants: 25, savings: 15 },
  aggressiveSaving: { needs: 60, wants: 10, savings: 30 },
};

export type AllocationType = 'Needs' | 'Wants' | 'Savings';

export interface SmartBudgetCategory {
  id: string;
  name: string;
  amount: number;
  allocationType: AllocationType;
}

interface CategoryTemplate {
  name: string;
  allocationType: AllocationType;
  defaultShare: number; // share within its bucket (0-1)
}

const CATEGORY_TEMPLATES: CategoryTemplate[] = [
  { name: 'Rent / Housing', allocationType: 'Needs', defaultShare: 0.40 },
  { name: 'Food & Groceries', allocationType: 'Needs', defaultShare: 0.25 },
  { name: 'Transport', allocationType: 'Needs', defaultShare: 0.15 },
  { name: 'Bills & Utilities', allocationType: 'Needs', defaultShare: 0.12 },
  { name: 'Health & Medical', allocationType: 'Needs', defaultShare: 0.08 },
  { name: 'Entertainment', allocationType: 'Wants', defaultShare: 0.35 },
  { name: 'Shopping', allocationType: 'Wants', defaultShare: 0.40 },
  { name: 'Education', allocationType: 'Wants', defaultShare: 0.25 },
  { name: 'Emergency Fund', allocationType: 'Savings', defaultShare: 0.50 },
  { name: 'Investment', allocationType: 'Savings', defaultShare: 0.50 },
];

export function generateBudgetPlan(
  income: number,
  mode: BudgetModeKey
): SmartBudgetCategory[] {
  const alloc = BUDGET_MODE_ALLOCATIONS[mode];
  const needsTotal = (income * alloc.needs) / 100;
  const wantsTotal = (income * alloc.wants) / 100;
  const savingsTotal = (income * alloc.savings) / 100;

  return CATEGORY_TEMPLATES.map((tpl, idx) => {
    let bucketTotal = 0;
    if (tpl.allocationType === 'Needs') bucketTotal = needsTotal;
    else if (tpl.allocationType === 'Wants') bucketTotal = wantsTotal;
    else bucketTotal = savingsTotal;

    return {
      id: `cat-${idx}-${Date.now()}`,
      name: tpl.name,
      amount: Math.round(bucketTotal * tpl.defaultShare),
      allocationType: tpl.allocationType,
    };
  });
}
