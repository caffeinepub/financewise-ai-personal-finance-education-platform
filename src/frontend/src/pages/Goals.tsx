import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, Target, TrendingUp, Trash2, Edit2, Calendar, 
  DollarSign, TrendingDown, Lightbulb, BarChart3, AlertTriangle 
} from 'lucide-react';
import { useGetSavingsGoals, useAddSavingsGoal, useUpdateSavingsGoal, useDeleteSavingsGoal, useGetUserTransactions } from '../hooks/useQueries';
import { useCurrency } from '../hooks/useCurrency';
import type { SavingsGoal } from '../types/local-types';
import { computeCurrentMonthAggregates } from '../lib/transactions/monthlyAggregates';
import { computeGoalPlanMetrics, computeDaysRemaining } from '../lib/goals/goalPlanning';
import { generateExpenseOptimizationSuggestions, getIncomeBoostIdeas } from '../lib/goals/goalCoachSuggestions';
import { computeTrackingStatus } from '../lib/goals/goalTracking';
import { generateSimulationScenarios } from '../lib/goals/goalSimulation';

export default function Goals() {
  const { data: goals = [], isLoading } = useGetSavingsGoals();
  const { data: transactions = [] } = useGetUserTransactions();
  const addGoal = useAddSavingsGoal();
  const updateGoal = useUpdateSavingsGoal();
  const deleteGoal = useDeleteSavingsGoal();
  const { format } = useCurrency();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [simulatingGoalId, setSimulatingGoalId] = useState<string | null>(null);

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalCurrent, setNewGoalCurrent] = useState('');
  const [newGoalTargetMonths, setNewGoalTargetMonths] = useState('6');

  // Compute monthly aggregates
  const monthlyAggregates = computeCurrentMonthAggregates(transactions);
  const expenseSuggestions = generateExpenseOptimizationSuggestions(transactions);
  const incomeIdeas = getIncomeBoostIdeas();

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetMonths = parseInt(newGoalTargetMonths) || 6;
    const goal = {
      name: newGoalName,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: parseFloat(newGoalCurrent) || 0,
      user: '' as any,
      createdAt: Date.now(),
      targetMonths,
    };

    await addGoal.mutateAsync(goal);
    setIsAddDialogOpen(false);
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalCurrent('');
    setNewGoalTargetMonths('6');
  };

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    await updateGoal.mutateAsync({
      id: editingGoal.id,
      updates: {
        name: editingGoal.name,
        targetAmount: editingGoal.targetAmount,
        currentAmount: editingGoal.currentAmount,
        targetMonths: editingGoal.targetMonths,
      },
    });
    
    setIsEditDialogOpen(false);
    setEditingGoal(null);
  };

  const openDeleteDialog = (goalId: string) => {
    setDeletingGoalId(goalId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingGoalId) {
      await deleteGoal.mutateAsync(deletingGoalId);
      setIsDeleteDialogOpen(false);
      setDeletingGoalId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingGoalId(null);
  };

  const openEditDialog = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsEditDialogOpen(true);
  };

  const toggleExpanded = (goalId: string) => {
    setExpandedGoalId(expandedGoalId === goalId ? null : goalId);
  };

  const toggleSimulation = (goalId: string) => {
    setSimulatingGoalId(simulatingGoalId === goalId ? null : goalId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Smart Goal Planning
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered financial coaching to help you achieve your goals
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
              <DialogDescription>
                Set a target amount and timeline to get personalized savings recommendations.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Goal Name</Label>
                <Input
                  id="goalName"
                  placeholder="e.g., Buy Laptop, Emergency Fund"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="60000"
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Savings (Optional)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="10000"
                  value={newGoalCurrent}
                  onChange={(e) => setNewGoalCurrent(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetMonths">Target Timeline (Months)</Label>
                <Input
                  id="targetMonths"
                  type="number"
                  placeholder="6"
                  value={newGoalTargetMonths}
                  onChange={(e) => setNewGoalTargetMonths(e.target.value)}
                  required
                  min="1"
                  step="1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={addGoal.isPending}>
                {addGoal.isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Overview */}
      {transactions.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-chart-1/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Current Month Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">{format(monthlyAggregates.income)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600">{format(monthlyAggregates.expenses)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Available Savings</p>
                <p className="text-2xl font-bold text-primary">{format(monthlyAggregates.availableSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first savings goal to get personalized recommendations
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Goal
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const metrics = computeGoalPlanMetrics(goal, monthlyAggregates.availableSavings);
            const tracking = computeTrackingStatus(goal);
            const isExpanded = expandedGoalId === goal.id;
            const isSimulating = simulatingGoalId === goal.id;
            const scenarios = isSimulating ? generateSimulationScenarios(goal, monthlyAggregates.availableSavings) : null;

            return (
              <Card key={goal.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
                <CardHeader className="bg-gradient-to-br from-primary/10 to-chart-1/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{goal.name}</CardTitle>
                      <CardDescription>
                        {format(goal.currentAmount)} of {format(goal.targetAmount)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(goal)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{metrics.progressPercent.toFixed(1)}%</span>
                    </div>
                    <Progress value={metrics.progressPercent} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-semibold">{format(metrics.remaining)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeline</p>
                      <p className="font-semibold">{goal.targetMonths || 6} months</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Required Monthly</span>
                      <span className="font-semibold text-primary">{format(metrics.requiredMonthlySaving)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Required Daily</span>
                      <span className="font-semibold">{format(metrics.requiredDailySaving)}</span>
                    </div>
                  </div>

                  {metrics.isFeasible === false && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Goal may be challenging with current savings capacity
                      </AlertDescription>
                    </Alert>
                  )}

                  {tracking && (
                    <div className="flex items-center gap-2">
                      <Badge variant={tracking.label === 'On track' ? 'default' : 'destructive'}>
                        {tracking.label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Score: {tracking.performanceScore}/100
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleExpanded(goal.id)}
                    >
                      <Lightbulb className="w-4 h-4 mr-1" />
                      {isExpanded ? 'Hide' : 'Show'} Tips
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleSimulation(goal.id)}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {isSimulating ? 'Hide' : 'Simulate'}
                    </Button>
                  </div>

                  {isExpanded && expenseSuggestions.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-orange-500" />
                        Expense Optimization
                      </h4>
                      {expenseSuggestions.slice(0, 2).map((suggestion, idx) => (
                        <div key={idx} className="text-xs space-y-1 p-2 bg-muted rounded">
                          <p className="font-medium">{suggestion.category}</p>
                          <p className="text-muted-foreground">
                            Current: {format(suggestion.currentSpend)} → Save {format(suggestion.estimatedSavings)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {isSimulating && scenarios && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-sm">Timeline Scenarios</h4>
                      {scenarios.map((scenario, idx) => (
                        <div key={idx} className="text-xs space-y-1 p-2 bg-muted rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{scenario.label}</span>
                            <Badge variant={scenario.feasibilityLabel === 'Achievable' ? 'default' : 'destructive'} className="text-xs">
                              {scenario.feasibilityLabel}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            {scenario.months} months • {format(scenario.requiredMonthlySaving)}/month
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Savings Goal</DialogTitle>
            <DialogDescription>
              Update your goal details and timeline.
            </DialogDescription>
          </DialogHeader>
          {editingGoal && (
            <form onSubmit={handleEditGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editGoalName">Goal Name</Label>
                <Input
                  id="editGoalName"
                  value={editingGoal.name}
                  onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTargetAmount">Target Amount</Label>
                <Input
                  id="editTargetAmount"
                  type="number"
                  value={editingGoal.targetAmount}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: parseFloat(e.target.value) })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCurrentAmount">Current Savings</Label>
                <Input
                  id="editCurrentAmount"
                  type="number"
                  value={editingGoal.currentAmount}
                  onChange={(e) => setEditingGoal({ ...editingGoal, currentAmount: parseFloat(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTargetMonths">Target Timeline (Months)</Label>
                <Input
                  id="editTargetMonths"
                  type="number"
                  value={editingGoal.targetMonths || 6}
                  onChange={(e) => setEditingGoal({ ...editingGoal, targetMonths: parseInt(e.target.value) })}
                  required
                  min="1"
                  step="1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={updateGoal.isPending}>
                {updateGoal.isPending ? 'Updating...' : 'Update Goal'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteGoal.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteGoal.isPending}
            >
              {deleteGoal.isPending ? 'Deleting...' : 'Delete Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
