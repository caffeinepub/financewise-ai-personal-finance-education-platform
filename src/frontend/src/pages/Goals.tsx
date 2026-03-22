import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Lightbulb,
  Loader2,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { SavingsGoal } from "../backend";
import { useCurrency } from "../hooks/useCurrency";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddSavingsGoal,
  useDeleteSavingsGoal,
  useGetSavingsGoals,
  useGetUserTransactions,
  useUpdateSavingsGoal,
} from "../hooks/useQueries";
import { generateExpenseOptimizationSuggestions } from "../lib/goals/goalCoachSuggestions";
import {
  computeDaysRemaining,
  computeGoalPlanMetrics,
} from "../lib/goals/goalPlanning";
import { computeTrackingStatus } from "../lib/goals/goalTracking";
import { computeCurrentMonthAggregates } from "../lib/transactions/monthlyAggregates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GoalFormData {
  name: string;
  targetAmount: string;
  savedAmount: string;
  deadlineDate: string;
  monthlyContribution: string;
  notes: string;
}

const emptyForm: GoalFormData = {
  name: "",
  targetAmount: "",
  savedAmount: "",
  deadlineDate: "",
  monthlyContribution: "",
  notes: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalGoal(goal: SavingsGoal) {
  const createdAtMs = Number(goal.createdAt) / 1_000_000;
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    user: goal.user,
    createdAt: createdAtMs,
    targetMonths: 6,
  };
}

function getProgressColor(percent: number, isOnTrack: boolean): string {
  if (percent >= 100) return "bg-emerald-500";
  if (isOnTrack) return "bg-emerald-500";
  if (percent >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function getDifficultyLabel(
  requiredMonthly: number,
  availableSavings: number,
): { label: string; color: string } {
  if (availableSavings <= 0) return { label: "Hard", color: "text-rose-500" };
  const ratio = requiredMonthly / availableSavings;
  if (ratio <= 0.3) return { label: "Easy", color: "text-emerald-500" };
  if (ratio <= 0.6) return { label: "Moderate", color: "text-amber-500" };
  return { label: "Hard", color: "text-rose-500" };
}

function computeDeadlineFromDate(
  dateStr: string,
): { targetDate: number; targetMonths: number } | null {
  if (!dateStr) return null;
  const deadline = new Date(dateStr).getTime();
  const now = Date.now();
  if (deadline <= now) return null;
  const months = Math.max(
    1,
    Math.ceil((deadline - now) / (1000 * 60 * 60 * 24 * 30)),
  );
  return { targetDate: deadline, targetMonths: months };
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function estimateCompletionDate(
  remaining: number,
  monthlyContrib: number,
): string {
  if (monthlyContrib <= 0 || remaining <= 0) return "N/A";
  const months = Math.ceil(remaining / monthlyContrib);
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return formatDate(date.getTime());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface AIMetricsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

function AIMetricsCard({ label, value, icon, highlight }: AIMetricsCardProps) {
  return (
    <div
      className={`rounded-xl p-3 flex flex-col gap-1 ${highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/60"}`}
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className={`font-bold text-sm ${highlight ? "text-primary" : ""}`}>
        {value}
      </p>
    </div>
  );
}

// ─── Goal Form ────────────────────────────────────────────────────────────────

interface GoalFormProps {
  form: GoalFormData;
  onChange: (field: keyof GoalFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  submitLabel: string;
  availableSavings: number;
  format: (n: number) => string;
  symbol: string;
}

function GoalForm({
  form,
  onChange,
  onSubmit,
  isPending,
  submitLabel,
  availableSavings,
  format,
  symbol,
}: GoalFormProps) {
  const target = Number.parseFloat(form.targetAmount) || 0;
  const saved = Number.parseFloat(form.savedAmount) || 0;
  const remaining = Math.max(0, target - saved);
  const monthly = Number.parseFloat(form.monthlyContribution) || 0;

  const deadlineInfo = computeDeadlineFromDate(form.deadlineDate);
  const monthsFromDeadline = deadlineInfo?.targetMonths ?? 0;
  const requiredMonthly =
    monthsFromDeadline > 0 ? remaining / monthsFromDeadline : 0;
  const requiredDaily = requiredMonthly / 30;
  const estimatedCompletion =
    monthly > 0
      ? estimateCompletionDate(remaining, monthly)
      : requiredMonthly > 0
        ? estimateCompletionDate(remaining, requiredMonthly)
        : "N/A";
  const difficulty = getDifficultyLabel(
    requiredMonthly || monthly,
    availableSavings,
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="goalName">Goal Name *</Label>
          <Input
            id="goalName"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g., Emergency Fund, Car, Travel"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="targetAmount">Target Amount *</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {symbol}
            </span>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0"
              value={form.targetAmount}
              onChange={(e) => onChange("targetAmount", e.target.value)}
              placeholder="0"
              required
              className="pl-7"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="savedAmount">Already Saved</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {symbol}
            </span>
            <Input
              id="savedAmount"
              type="number"
              step="0.01"
              min="0"
              value={form.savedAmount}
              onChange={(e) => onChange("savedAmount", e.target.value)}
              placeholder="0"
              className="pl-7"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="deadlineDate">Target Deadline</Label>
          <Input
            id="deadlineDate"
            type="date"
            value={form.deadlineDate}
            onChange={(e) => onChange("deadlineDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="monthlyContrib">Monthly Saving Plan</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {symbol}
            </span>
            <Input
              id="monthlyContrib"
              type="number"
              step="0.01"
              min="0"
              value={form.monthlyContribution}
              onChange={(e) => onChange("monthlyContribution", e.target.value)}
              placeholder="Optional"
              className="pl-7"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Why is this goal important to you?"
            rows={2}
            className="mt-1 resize-none"
          />
        </div>
      </div>

      {/* AI Auto-Calculations */}
      {target > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Brain className="h-4 w-4" />
            AI Auto-Calculations
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <AIMetricsCard
              label="Remaining"
              value={format(remaining)}
              icon={<Target className="h-3 w-3" />}
            />
            {requiredMonthly > 0 && (
              <AIMetricsCard
                label="Monthly Needed"
                value={format(requiredMonthly)}
                icon={<Calendar className="h-3 w-3" />}
                highlight
              />
            )}
            {requiredDaily > 0 && (
              <AIMetricsCard
                label="Daily Needed"
                value={format(requiredDaily)}
                icon={<Clock className="h-3 w-3" />}
              />
            )}
            <AIMetricsCard
              label="Est. Completion"
              value={estimatedCompletion}
              icon={<CheckCircle2 className="h-3 w-3" />}
            />
          </div>
          {(requiredMonthly > 0 || monthly > 0) && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Saving Difficulty:</span>
              <span className={`font-semibold ${difficulty.color}`}>
                {difficulty.label}
              </span>
            </div>
          )}
        </div>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Optimize Panel ───────────────────────────────────────────────────────────

interface OptimizePanelProps {
  goal: SavingsGoal;
  availableSavings: number;
  expenseSuggestions: ReturnType<typeof generateExpenseOptimizationSuggestions>;
  format: (n: number) => string;
}

function OptimizePanel({
  goal,
  availableSavings,
  expenseSuggestions,
  format,
}: OptimizePanelProps) {
  const target = Number(goal.targetAmount);
  const current = Number(goal.currentAmount);
  const remaining = Math.max(0, target - current);
  const currentMonthly = availableSavings * 0.5;
  const optimizedMonthly = Math.min(availableSavings * 0.7, remaining);
  const currentMonths =
    currentMonthly > 0 ? Math.ceil(remaining / currentMonthly) : 99;
  const optimizedMonths =
    optimizedMonthly > 0 ? Math.ceil(remaining / optimizedMonthly) : 99;
  const monthsSaved = Math.max(0, currentMonths - optimizedMonths);

  const optimizedDate = new Date();
  optimizedDate.setMonth(optimizedDate.getMonth() + optimizedMonths);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Sparkles className="h-4 w-4" />
        AI Optimization Results
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/60 p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Current Plan</p>
          <p className="font-bold text-base">
            {format(currentMonthly)}
            <span className="text-xs font-normal text-muted-foreground">
              /mo
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {currentMonths} months
          </p>
        </div>
        <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 space-y-1">
          <p className="text-xs text-primary font-medium">Optimized Plan ✨</p>
          <p className="font-bold text-base text-primary">
            {format(optimizedMonthly)}
            <span className="text-xs font-normal text-primary/70">/mo</span>
          </p>
          <p className="text-xs text-primary/70">{optimizedMonths} months</p>
        </div>
      </div>

      {monthsSaved > 0 && (
        <Alert className="bg-emerald-500/10 border-emerald-500/20">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-300 text-sm">
            🎉 Reach your goal{" "}
            <strong>
              {monthsSaved} month{monthsSaved > 1 ? "s" : ""} earlier
            </strong>{" "}
            — by {formatDate(optimizedDate.getTime())}
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg bg-muted/40 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Daily saving target</span>
        </div>
        <span className="font-bold text-primary">
          {format(optimizedMonthly / 30)}/day
        </span>
      </div>

      {expenseSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Expense Reduction Tips
          </p>
          {expenseSuggestions.slice(0, 3).map((s) => (
            <div
              key={s.category}
              className="flex items-start gap-2 text-sm p-2 rounded-lg bg-muted/40"
            >
              <TrendingDown className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium">{s.category}</span>
                <span className="text-muted-foreground">
                  {" "}
                  — reduce by {s.reductionPercent}% → save{" "}
                </span>
                <span className="font-semibold text-emerald-600">
                  {format(s.estimatedSavings)}/mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {expenseSuggestions.length === 0 && (
        <div className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/40 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Add transactions to get personalized expense reduction tips.
        </div>
      )}
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

interface GoalCardProps {
  goal: SavingsGoal;
  availableSavings: number;
  monthlyIncome: number;
  expenseSuggestions: ReturnType<typeof generateExpenseOptimizationSuggestions>;
  format: (n: number) => string;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

function GoalCard({
  goal,
  availableSavings,
  monthlyIncome,
  expenseSuggestions,
  format,
  onEdit,
  onDelete,
}: GoalCardProps) {
  const [optimizeOpen, setOptimizeOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const localGoal = toLocalGoal(goal);
  const target = localGoal.targetAmount;
  const current = localGoal.currentAmount;
  const remaining = Math.max(0, target - current);
  const progressPercent =
    target > 0 ? Math.min(100, (current / target) * 100) : 0;

  const metrics = computeGoalPlanMetrics(localGoal as any, monthlyIncome);
  const tracking = computeTrackingStatus(localGoal as any);
  const daysRemaining = computeDaysRemaining(localGoal as any);
  const _difficulty = getDifficultyLabel(
    metrics.requiredMonthlySaving,
    availableSavings,
  );
  const isOnTrack = tracking.label === "On track";
  const progressColor = getProgressColor(progressPercent, isOnTrack);

  const insightMessage = useMemo(() => {
    if (progressPercent >= 100)
      return {
        text: "🎉 Goal achieved! Congratulations!",
        color: "text-emerald-600",
      };
    if (isOnTrack && tracking.performanceScore >= 80)
      return {
        text: "🚀 You're saving very well! Keep it up!",
        color: "text-emerald-600",
      };
    if (isOnTrack)
      return {
        text: "✅ You are on track to complete your goal.",
        color: "text-emerald-600",
      };
    const shortfall = metrics.requiredMonthlySaving - availableSavings * 0.5;
    if (shortfall > 0) {
      return {
        text: `⚡ Increase savings by ${format(shortfall)}/month to finish on time.`,
        color: "text-amber-600",
      };
    }
    return {
      text: "📈 At current rate, goal may take longer. Consider optimizing.",
      color: "text-amber-600",
    };
  }, [
    progressPercent,
    isOnTrack,
    tracking.performanceScore,
    metrics.requiredMonthlySaving,
    availableSavings,
    format,
  ]);

  const handleOptimize = () => {
    if (!optimizeOpen) {
      setIsOptimizing(true);
      setTimeout(() => {
        setIsOptimizing(false);
        setOptimizeOpen(true);
      }, 800);
    } else {
      setOptimizeOpen(false);
    }
  };

  // Safely display days remaining — computeDaysRemaining returns number | null
  const daysRemainingDisplay =
    daysRemaining !== null && daysRemaining > 0 ? String(daysRemaining) : "—";

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="h-1 w-full bg-muted">
        <div
          className={`h-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{goal.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(current)} of {format(target)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Badge
              variant={
                progressPercent >= 100
                  ? "default"
                  : isOnTrack
                    ? "secondary"
                    : "outline"
              }
              className="text-xs"
            >
              {progressPercent >= 100
                ? "✓ Done"
                : `${Math.round(progressPercent)}%`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <Progress value={progressPercent} className="h-2" />

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-2">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-sm font-bold">{format(remaining)}</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <p className="text-sm font-bold">
              {format(metrics.requiredMonthlySaving)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-2">
            <p className="text-xs text-muted-foreground">Days Left</p>
            <p className="text-sm font-bold">{daysRemainingDisplay}</p>
          </div>
        </div>

        <div
          className={`text-xs p-2 rounded-lg bg-muted/20 ${insightMessage.color}`}
        >
          {insightMessage.text}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 text-xs"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Zap className="h-3 w-3 text-amber-500" />
            )}
            {optimizeOpen ? "Hide Plan" : "Optimize Goal"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(goal)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {optimizeOpen && (
          <div className="border-t pt-3">
            <OptimizePanel
              goal={goal}
              availableSavings={availableSavings}
              expenseSuggestions={expenseSuggestions}
              format={format}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Goals Page ──────────────────────────────────────────────────────────

export default function Goals() {
  const { identity } = useInternetIdentity();
  const { data: goals = [], isLoading } = useGetSavingsGoals();
  const { data: transactions = [] } = useGetUserTransactions();
  const addGoal = useAddSavingsGoal();
  const updateGoal = useUpdateSavingsGoal();
  const deleteGoal = useDeleteSavingsGoal();
  const { format, symbol } = useCurrency();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [addForm, setAddForm] = useState<GoalFormData>(emptyForm);
  const [editForm, setEditForm] = useState<GoalFormData>(emptyForm);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(false);

  const aggregates = useMemo(
    () => computeCurrentMonthAggregates(transactions),
    [transactions],
  );
  const expenseSuggestions = useMemo(
    () => generateExpenseOptimizationSuggestions(transactions),
    [transactions],
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;
    const target = Number.parseFloat(addForm.targetAmount) || 0;
    const current = Number.parseFloat(addForm.savedAmount) || 0;
    await addGoal.mutateAsync({
      id: Date.now().toString(),
      name: addForm.name.trim(),
      targetAmount: target,
      currentAmount: current,
      user: identity.getPrincipal(),
      createdAt: BigInt(Date.now() * 1_000_000),
    });
    setAddForm(emptyForm);
    setShowAddDialog(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !identity) return;
    const target = Number.parseFloat(editForm.targetAmount) || 0;
    const current = Number.parseFloat(editForm.savedAmount) || 0;
    await updateGoal.mutateAsync({
      goalId: editingGoal.id,
      updatedGoal: {
        id: editingGoal.id,
        name: editForm.name.trim(),
        targetAmount: target,
        currentAmount: current,
        user: identity.getPrincipal(),
        createdAt: editingGoal.createdAt,
      },
    });
    setEditingGoal(null);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setEditForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      savedAmount: String(goal.currentAmount),
      deadlineDate: "",
      monthlyContribution: "",
      notes: "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this goal?")) {
      await deleteGoal.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Savings Goals
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI-powered goal planning and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSuggestionsPanel(!showSuggestionsPanel)}
            className="gap-1 hidden sm:flex"
          >
            <Brain className="h-4 w-4" />
            AI Coach
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a savings target and let AI calculate your plan.
                </DialogDescription>
              </DialogHeader>
              <GoalForm
                form={addForm}
                onChange={(field, value) =>
                  setAddForm((prev) => ({ ...prev, [field]: value }))
                }
                onSubmit={handleAddSubmit}
                isPending={addGoal.isPending}
                submitLabel="Create Goal"
                availableSavings={aggregates.availableSavings}
                format={format}
                symbol={symbol}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Monthly Income</p>
            <p className="text-lg font-bold text-green-500">
              {format(aggregates.income)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Monthly Expenses</p>
            <p className="text-lg font-bold text-red-500">
              {format(aggregates.expenses)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-3">
            <p className="text-xs text-muted-foreground">Available Savings</p>
            <p className="text-lg font-bold text-primary">
              {format(aggregates.availableSavings)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions Panel */}
      {showSuggestionsPanel && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Saving Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {expenseSuggestions.length > 0 ? (
              expenseSuggestions.map((s) => (
                <div
                  key={s.suggestion}
                  className="flex items-start gap-2 text-sm p-2 rounded-lg bg-background/60"
                >
                  <TrendingDown className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">{s.suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Add transactions to get personalized saving suggestions.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No goals yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first savings goal and let AI plan your path to
              success.
            </p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              availableSavings={aggregates.availableSavings}
              monthlyIncome={aggregates.income}
              expenseSuggestions={expenseSuggestions}
              format={format}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingGoal}
        onOpenChange={(open) => !open && setEditingGoal(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update your savings goal details.
            </DialogDescription>
          </DialogHeader>
          {editingGoal && (
            <GoalForm
              form={editForm}
              onChange={(field, value) =>
                setEditForm((prev) => ({ ...prev, [field]: value }))
              }
              onSubmit={handleEditSubmit}
              isPending={updateGoal.isPending}
              submitLabel="Save Changes"
              availableSavings={aggregates.availableSavings}
              format={format}
              symbol={symbol}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
