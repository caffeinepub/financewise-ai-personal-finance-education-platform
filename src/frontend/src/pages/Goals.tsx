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
      goalId: editingGoal.id,
      updatedGoal: {
        ...editingGoal,
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
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Smart Goal Planning</h1>
            <p className="text-muted-foreground">AI-powered financial coaching for your savings goals</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Savings Goal</DialogTitle>
                <DialogDescription>Set a target and track your progress</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    placeholder="e.g., Emergency Fund, Vacation, New Car"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentAmount">Current Amount (Optional)</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    value={newGoalCurrent}
                    onChange={(e) => setNewGoalCurrent(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="targetMonths">Target Timeline (Months)</Label>
                  <Input
                    id="targetMonths"
                    type="number"
                    value={newGoalTargetMonths}
                    onChange={(e) => setNewGoalTargetMonths(e.target.value)}
                    placeholder="6"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={addGoal.isPending}>
                    {addGoal.isPending ? 'Creating...' : 'Create Goal'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Start by creating your first savings goal
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const isExpanded = expandedGoalId === goal.id;
              const isSimulating = simulatingGoalId === goal.id;
              
              // Use monthlyIncome from aggregates
              const metrics = computeGoalPlanMetrics(goal, monthlyAggregates.income);
              const trackingStatus = computeTrackingStatus(goal);
              const scenarios = generateSimulationScenarios(goal, monthlyAggregates.income);

              return (
                <Card key={goal.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          {goal.name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {format(goal.currentAmount)} of {format(goal.targetAmount)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(goal)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className="font-semibold">{format(remaining)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Required Monthly</p>
                        <p className="font-semibold">{format(metrics.requiredMonthlySaving)}</p>
                      </div>
                    </div>

                    {metrics.isFeasible === false && metrics.warningMessage && (
                      <Alert className="bg-amber-500/10 border-amber-500/20">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                          {metrics.warningMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(goal.id)}
                        className="flex-1"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        {isExpanded ? 'Hide' : 'Show'} AI Coaching
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSimulation(goal.id)}
                        className="flex-1"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        {isSimulating ? 'Hide' : 'Show'} Scenarios
                      </Button>
                    </div>

                    {isExpanded && (
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Expense Optimization
                          </h4>
                          <div className="space-y-2">
                            {expenseSuggestions.slice(0, 3).map((suggestion, idx) => (
                              <div key={idx} className="text-sm p-2 bg-muted rounded">
                                <p className="font-medium">{suggestion.category}</p>
                                <p className="text-muted-foreground">
                                  Save {format(suggestion.estimatedSavings)}/month • {suggestion.suggestion}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Income Boost Ideas
                          </h4>
                          <div className="space-y-2">
                            {incomeIdeas.slice(0, 3).map((idea, idx) => (
                              <div key={idx} className="text-sm p-2 bg-muted rounded">
                                <p className="font-medium">{idea.title}</p>
                                <p className="text-muted-foreground">{idea.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {isSimulating && (
                      <div className="space-y-3 pt-4 border-t">
                        <h4 className="font-semibold">Timeline Scenarios</h4>
                        {scenarios.map((scenario, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Scenario {scenario.label}</span>
                              <Badge variant={scenario.isFeasible ? 'default' : 'destructive'}>
                                {scenario.feasibilityLabel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>Update your savings goal details</DialogDescription>
            </DialogHeader>
            {editingGoal && (
              <form onSubmit={handleEditGoal} className="space-y-4">
                <div>
                  <Label htmlFor="editGoalName">Goal Name</Label>
                  <Input
                    id="editGoalName"
                    value={editingGoal.name}
                    onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editTargetAmount">Target Amount</Label>
                  <Input
                    id="editTargetAmount"
                    type="number"
                    step="0.01"
                    value={editingGoal.targetAmount}
                    onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCurrentAmount">Current Amount</Label>
                  <Input
                    id="editCurrentAmount"
                    type="number"
                    step="0.01"
                    value={editingGoal.currentAmount}
                    onChange={(e) => setEditingGoal({ ...editingGoal, currentAmount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={updateGoal.isPending}>
                    {updateGoal.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </DialogFooter>
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
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteGoal.isPending}>
                {deleteGoal.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
