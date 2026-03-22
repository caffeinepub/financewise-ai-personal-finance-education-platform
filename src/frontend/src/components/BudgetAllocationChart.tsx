import React from "react";
import {
  BUDGET_MODE_ALLOCATIONS,
  type BudgetModeKey,
} from "../lib/budget-planner/budgetModes";

interface AllocationData {
  needsPercent: number;
  wantsPercent: number;
  savingsPercent: number;
}

interface Props {
  actual: AllocationData;
  mode: BudgetModeKey;
  needsTotal: number;
  wantsTotal: number;
  savingsTotal: number;
  formatAmount: (n: number) => string;
}

export default function BudgetAllocationChart({
  actual,
  mode,
  needsTotal,
  wantsTotal,
  savingsTotal,
  formatAmount,
}: Props) {
  const target = BUDGET_MODE_ALLOCATIONS[mode];
  const total =
    actual.needsPercent + actual.wantsPercent + actual.savingsPercent;

  const needsPct = total > 0 ? actual.needsPercent : 0;
  const wantsPct = total > 0 ? actual.wantsPercent : 0;
  const savingsPct = total > 0 ? actual.savingsPercent : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Actual Allocation</span>
          <span className="text-xs">
            {needsPct}% / {wantsPct}% / {savingsPct}%
          </span>
        </div>
        <div className="flex h-6 rounded-full overflow-hidden w-full">
          <div
            className="bg-blue-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${needsPct}%` }}
          >
            {needsPct >= 10 ? `${needsPct}%` : ""}
          </div>
          <div
            className="bg-purple-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${wantsPct}%` }}
          >
            {wantsPct >= 10 ? `${wantsPct}%` : ""}
          </div>
          <div
            className="bg-emerald-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${savingsPct}%` }}
          >
            {savingsPct >= 10 ? `${savingsPct}%` : ""}
          </div>
          {total === 0 && (
            <div className="bg-muted flex-1 flex items-center justify-center text-muted-foreground text-xs">
              No data
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span className="text-muted-foreground">Needs</span>
            <span className="font-semibold">{formatAmount(needsTotal)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            <span className="text-muted-foreground">Wants</span>
            <span className="font-semibold">{formatAmount(wantsTotal)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-muted-foreground">Savings</span>
            <span className="font-semibold">{formatAmount(savingsTotal)}</span>
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            Target ({BUDGET_MODE_ALLOCATIONS[mode].needs}% /{" "}
            {BUDGET_MODE_ALLOCATIONS[mode].wants}% /{" "}
            {BUDGET_MODE_ALLOCATIONS[mode].savings}%)
          </span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden w-full">
          <div
            className="bg-blue-300 transition-all duration-500"
            style={{ width: `${target.needs}%` }}
          />
          <div
            className="bg-purple-300 transition-all duration-500"
            style={{ width: `${target.wants}%` }}
          />
          <div
            className="bg-emerald-300 transition-all duration-500"
            style={{ width: `${target.savings}%` }}
          />
        </div>
        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
          <span>Needs {target.needs}%</span>
          <span>Wants {target.wants}%</span>
          <span>Savings {target.savings}%</span>
        </div>
      </div>
    </div>
  );
}
