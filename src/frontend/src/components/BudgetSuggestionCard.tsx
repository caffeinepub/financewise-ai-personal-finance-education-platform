import { AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import React from "react";
import type { BudgetSuggestion } from "../lib/budget-planner/budgetSuggestions";

interface Props {
  suggestion: BudgetSuggestion;
}

export default function BudgetSuggestionCard({ suggestion }: Props) {
  const config = {
    warning: {
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-200",
    },
    tip: {
      icon: <Lightbulb className="w-4 h-4 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-200",
    },
    opportunity: {
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-800 dark:text-emerald-200",
    },
  };

  const style = config[suggestion.type];

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${style.bg} ${style.border}`}
    >
      <div className="mt-0.5 shrink-0">{style.icon}</div>
      <p className={`text-sm ${style.text}`}>{suggestion.message}</p>
    </div>
  );
}
