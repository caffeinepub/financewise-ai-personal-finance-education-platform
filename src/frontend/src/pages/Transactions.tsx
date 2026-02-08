import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserTransactions, useDeleteTransaction, useUpdateTransaction } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, Search, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import AccessDenied from '../components/AccessDenied';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { TransactionData } from '../types/backend-types';
import { toast } from 'sonner';

const EXPENSE_CATEGORIES = ['Entertainment', 'Housing & Utilities', 'Transportation', 'Shopping', 'Food & Dining', 'Healthcare', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
const PAYMENT_TYPES = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default function Transactions() {
  const { identity } = useInternetIdentity();
  const { data: transactions = [] } = useGetUserTransactions();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTransaction, setEditTransaction] = useState<TransactionData | null>(null);

  // Edit form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [date, setDate] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => 
        t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => Number(b.date) - Number(a.date));
  }, [transactions, searchQuery]);

  const categoryColors: Record<string, string> = {
    'Entertainment': 'default',
    'Housing & Utilities': 'secondary',
    'Transportation': 'outline',
    'Shopping': 'default',
    'Food & Dining': 'secondary',
    'Other': 'secondary',
  };

  if (!identity) {
    return <AccessDenied />;
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteTransaction.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  const handleEdit = (transaction: TransactionData) => {
    setEditTransaction(transaction);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setNote(transaction.notes);
    setPaymentType(transaction.paymentType);
    setDate(new Date(Number(transaction.date) / 1000000).toISOString().split('T')[0]);
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTransaction || !amount || !category || !paymentType) {
      toast.error('Error: Please enter all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Error: Please enter a valid amount greater than 0');
      return;
    }

    const updatedTransaction: TransactionData = {
      ...editTransaction,
      amount: amountNum,
      category,
      notes: note,
      date: new Date(date).getTime() * 1000000,
      paymentType,
    };

    updateTransaction.mutate(updatedTransaction, {
      onSuccess: () => {
        setEditTransaction(null);
        setAmount('');
        setCategory('');
        setNote('');
        setPaymentType('');
        setDate('');
      },
    });
  };

  const categories = editTransaction?.transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground">All Transactions</h1>
          <p className="text-muted-foreground">A complete history of your financial activity.</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by note or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and manage all your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category/Type</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => {
                      const date = new Date(Number(transaction.date) / 1000000);
                      const isIncome = transaction.transactionType === 'income';
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-chart-2/10' : 'bg-destructive/10'}`}>
                                <span className={isIncome ? 'text-chart-2' : 'text-destructive'}>
                                  {isIncome ? '↑' : '↓'}
                                </span>
                              </div>
                              <span>{transaction.notes || 'No description'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant={categoryColors[transaction.category] as any}>
                                {transaction.category}
                              </Badge>
                              <div className="text-xs text-muted-foreground">{transaction.paymentType}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isIncome ? 'default' : 'destructive'}>
                              {isIncome ? 'Income' : 'Expense'}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-right font-semibold ${isIncome ? 'text-chart-2' : ''}`}>
                            {isIncome ? '+' : ''}₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(transaction.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? 'No transactions found matching your search' : 'No transactions yet'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editTransaction} onOpenChange={() => setEditTransaction(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update the transaction details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTransaction} className="space-y-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                {editTransaction?.transactionType === 'income' ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-chart-2" />
                    <span className="font-medium">Income</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    <span className="font-medium">Expense</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  placeholder="₹0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note">Note</Label>
              <Textarea
                id="edit-note"
                placeholder="Add a note (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentType">Payment Type *</Label>
                <Select value={paymentType} onValueChange={setPaymentType} required>
                  <SelectTrigger id="edit-paymentType">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditTransaction(null)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={updateTransaction.isPending}>
                {updateTransaction.isPending ? 'Updating...' : 'Update Transaction'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
