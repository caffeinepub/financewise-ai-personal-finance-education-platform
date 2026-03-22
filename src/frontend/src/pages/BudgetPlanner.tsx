import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { BudgetMode, Currency } from "../backend";
import BudgetAllocationChart from "../components/BudgetAllocationChart";
import BudgetSuggestionCard from "../components/BudgetSuggestionCard";
import { useGetBudgetPlan, useSaveBudgetPlan } from "../hooks/useBudgetPlan";
import { useCurrency } from "../hooks/useCurrency";
import { useGetUserPreferences } from "../hooks/useQueries";
import {
  calculateBudgetPercentages,
  calculateBudgetTotals,
} from "../lib/budget-planner/budgetCalculations";
import {
  type AllocationType,
  BUDGET_MODE_ALLOCATIONS,
  BUDGET_MODE_LABELS,
  type BudgetModeKey,
  type SmartBudgetCategory,
  generateBudgetPlan,
} from "../lib/budget-planner/budgetModes";
import { generateBudgetSuggestions } from "../lib/budget-planner/budgetSuggestions";

const ALLOCATION_COLORS: Record<AllocationType, string> = {
  Needs: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  Wants:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  Savings:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

function modeKeyToBackend(mode: BudgetModeKey): BudgetMode {
  switch (mode) {
    case "student":
      return BudgetMode.student;
    case "professional":
      return BudgetMode.professional;
    case "aggressiveSaving":
      return BudgetMode.custom;
    case "family":
      return BudgetMode.retired;
    default:
      return BudgetMode.evilBudget;
  }
}

function backendModeToKey(mode: BudgetMode): BudgetModeKey {
  switch (mode) {
    case BudgetMode.student:
      return "student";
    case BudgetMode.professional:
      return "professional";
    case BudgetMode.retired:
      return "family";
    case BudgetMode.custom:
      return "aggressiveSaving";
    default:
      return "beginner";
  }
}

export default function BudgetPlanner() {
  const { format, symbol, currencyCode, convertToUSD } = useCurrency();
  const { data: savedPlan, isLoading: _planLoading } = useGetBudgetPlan();
  const { data: _preferences } = useGetUserPreferences();
  const saveMutation = useSaveBudgetPlan();

  const [income, setIncome] = useState("");
  const [mode, setMode] = useState<BudgetModeKey>("professional");
  const [categories, setCategories] = useState<SmartBudgetCategory[]>([]);
  const [generated, setGenerated] = useState(false);

  // Add category dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatAmount, setNewCatAmount] = useState("");
  const [newCatType, setNewCatType] = useState<AllocationType>("Needs");

  // Load saved plan on mount
  useEffect(() => {
    if (savedPlan) {
      const plan = savedPlan.plan;
      setMode(backendModeToKey(plan.selectedMode));
      // Reconstruct categories from amounts
      const cats: SmartBudgetCategory[] = plan.categories.map((bc, idx) => {
        const amountEntry = plan.amounts.find(([name]) => name === bc.name);
        const allocType: AllocationType =
          bc.color === "blue"
            ? "Needs"
            : bc.color === "purple"
              ? "Wants"
              : "Savings";
        return {
          id: bc.id || `cat-${idx}`,
          name: bc.name,
          amount: amountEntry ? amountEntry[1] : bc.monthlyAllocation,
          allocationType: allocType,
        };
      });
      if (cats.length > 0) {
        setCategories(cats);
        setGenerated(true);
      }
    }
  }, [savedPlan]);

  const incomeNum = Number.parseFloat(income) || 0;
  const incomeInUSD = convertToUSD(incomeNum);

  const totals = calculateBudgetTotals(categories);
  const percentages = calculateBudgetPercentages(totals, incomeInUSD);
  const suggestions = generated
    ? generateBudgetSuggestions(categories, incomeInUSD, mode)
    : [];

  const handleGenerate = () => {
    if (incomeInUSD <= 0) return;
    const plan = generateBudgetPlan(incomeInUSD, mode);
    setCategories(plan);
    setGenerated(true);
  };

  const handleAmountChange = useCallback((id: string, value: string) => {
    const num = Number.parseFloat(value) || 0;
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, amount: num } : cat)),
    );
  }, []);

  const handleDeleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }, []);

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const amountNum = Number.parseFloat(newCatAmount) || 0;
    const newCat: SmartBudgetCategory = {
      id: `cat-custom-${Date.now()}`,
      name: newCatName.trim(),
      amount: amountNum,
      allocationType: newCatType,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCatName("");
    setNewCatAmount("");
    setNewCatType("Needs");
    setAddDialogOpen(false);
  };

  const handleSave = () => {
    const backendCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      monthlyAllocation: cat.amount,
      priorityLevel: BigInt(1),
      isMandatory: cat.allocationType === "Needs",
      color:
        cat.allocationType === "Needs"
          ? "blue"
          : cat.allocationType === "Wants"
            ? "purple"
            : "green",
      icon: "",
    }));

    const backendAmounts: [string, number][] = categories.map((cat) => [
      cat.name,
      cat.amount,
    ]);

    const currencyEnum: Currency =
      currencyCode === "INR"
        ? Currency.inr
        : currencyCode === "EUR"
          ? Currency.eur
          : Currency.usd;

    saveMutation.mutate({
      categories: backendCategories,
      amounts: backendAmounts,
      selectedMode: modeKeyToBackend(mode),
      currency: currencyEnum,
    });
  };

  const needsByType = categories.filter((c) => c.allocationType === "Needs");
  const wantsByType = categories.filter((c) => c.allocationType === "Wants");
  const savingsByType = categories.filter(
    (c) => c.allocationType === "Savings",
  );

  const predictedExpenses = totals.needsTotal + totals.wantsTotal;
  const predictedSavings = totals.savingsTotal;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Smart AI Budget Planner
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Rule-based AI generates a personalized budget plan based on your
            income and goals.
          </p>
        </div>
        {generated && (
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Budget
          </Button>
        )}
      </div>

      {/* Setup Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income ({symbol})</Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground font-medium text-sm select-none pointer-events-none z-10">
                  {symbol}
                </span>
                <Input
                  id="income"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Enter your monthly income"
                  className="pl-8"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget Mode</Label>
              <Select
                value={mode}
                onValueChange={(v) => setMode(v as BudgetModeKey)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(BUDGET_MODE_LABELS) as BudgetModeKey[]).map(
                    (key) => (
                      <SelectItem key={key} value={key}>
                        {BUDGET_MODE_LABELS[key]} —{" "}
                        {BUDGET_MODE_ALLOCATIONS[key].needs}/
                        {BUDGET_MODE_ALLOCATIONS[key].wants}/
                        {BUDGET_MODE_ALLOCATIONS[key].savings}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Needs {BUDGET_MODE_ALLOCATIONS[mode].needs}% / Wants{" "}
                {BUDGET_MODE_ALLOCATIONS[mode].wants}% / Savings{" "}
                {BUDGET_MODE_ALLOCATIONS[mode].savings}%
              </p>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={incomeNum <= 0}
            className="gap-2 w-full md:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            Generate AI Budget Plan
          </Button>
        </CardContent>
      </Card>

      {generated && (
        <>
          {/* Allocation Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Budget Allocation Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetAllocationChart
                actual={percentages}
                mode={mode}
                needsTotal={totals.needsTotal}
                wantsTotal={totals.wantsTotal}
                savingsTotal={totals.savingsTotal}
                formatAmount={format}
              />
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Budget Categories</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddDialogOpen(true)}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["Needs", "Wants", "Savings"] as AllocationType[]).map(
                (type) => {
                  const typeCats =
                    type === "Needs"
                      ? needsByType
                      : type === "Wants"
                        ? wantsByType
                        : savingsByType;
                  if (typeCats.length === 0) return null;
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={ALLOCATION_COLORS[type]}>
                          {type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Total:{" "}
                          {format(typeCats.reduce((s, c) => s + c.amount, 0))}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {typeCats.map((cat) => (
                          <div
                            key={cat.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                          >
                            <span className="flex-1 text-sm font-medium truncate">
                              {cat.name}
                            </span>
                            <div className="relative flex items-center w-36">
                              <span className="absolute left-2 text-muted-foreground text-xs pointer-events-none">
                                {symbol}
                              </span>
                              <Input
                                type="number"
                                value={cat.amount}
                                onChange={(e) =>
                                  handleAmountChange(cat.id, e.target.value)
                                }
                                className="pl-6 h-8 text-sm"
                                min="0"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  );
                },
              )}

              {/* Summary Row */}
              <div className="flex items-center justify-between pt-2 font-semibold text-sm">
                <span>Total Budget</span>
                <span>{format(totals.grandTotal)}</span>
              </div>
              {incomeInUSD > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Remaining (unallocated)</span>
                  <span
                    className={
                      incomeInUSD - totals.grandTotal < 0
                        ? "text-destructive"
                        : "text-emerald-600"
                    }
                  >
                    {format(incomeInUSD - totals.grandTotal)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spending Prediction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Predicted Monthly Expenses
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {format(predictedExpenses)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Needs + Wants combined
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Predicted Monthly Savings
                </p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {format(predictedSavings)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on current budget plan
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Budget Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.map((s) => (
                <BudgetSuggestionCard key={s.id} suggestion={s} />
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                * Suggestions are rule-based estimates for educational purposes
                only. Not financial advice.
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Category Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g., Gym Membership"
              />
            </div>
            <div className="space-y-2">
              <Label>Amount ({symbol})</Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-muted-foreground text-sm pointer-events-none">
                  {symbol}
                </span>
                <Input
                  type="number"
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(e.target.value)}
                  placeholder="0"
                  className="pl-8"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Allocation Type</Label>
              <Select
                value={newCatType}
                onValueChange={(v) => setNewCatType(v as AllocationType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Needs">Needs</SelectItem>
                  <SelectItem value="Wants">Wants</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCatName.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
