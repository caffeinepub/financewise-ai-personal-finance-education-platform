import { useState } from 'react';
import { useGetUserTransactions, useDeleteTransaction, useUpdateTransaction } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Trash2, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '../hooks/useCurrency';
import { TransactionData } from '../backend';

const EXPENSE_CATEGORIES = ['Entertainment', 'Housing & Utilities', 'Transportation', 'Shopping', 'Food & Dining', 'Healthcare', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'];
const PAYMENT_TYPES = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer'];

export default function Transactions() {
  const { data: transactions = [], isLoading } = useGetUserTransactions();
  const deleteTransaction = useDeleteTransaction();
  const updateTransaction = useUpdateTransaction();
  const { format } = useCurrency();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPaymentType, setEditPaymentType] = useState('');

  const filteredTransactions = transactions.filter((t) =>
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEdit = (t: TransactionData) => {
    setEditingTransaction(t);
    setEditAmount(String(t.amount));
    setEditCategory(t.category);
    setEditNotes(t.notes);
    setEditPaymentType(t.paymentType);
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;
    await updateTransaction.mutateAsync({
      id: editingTransaction.id,
      updates: {
        amount: parseFloat(editAmount) || 0,
        category: editCategory,
        notes: editNotes,
        paymentType: editPaymentType,
      },
    });
    setEditingTransaction(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Your complete transaction history</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by category or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'No transactions match your search.' : 'No transactions yet. Add your first transaction in Analytics.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Badge
                          variant={t.transactionType === 'income' ? 'default' : 'destructive'}
                          className="flex items-center gap-1 w-fit"
                        >
                          {t.transactionType === 'income'
                            ? <TrendingUp className="h-3 w-3" />
                            : <TrendingDown className="h-3 w-3" />}
                          {t.transactionType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{t.category}</TableCell>
                      <TableCell className={t.transactionType === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {t.transactionType === 'income' ? '+' : '-'}{format(Number(t.amount))}
                      </TableCell>
                      <TableCell>{t.paymentType}</TableCell>
                      <TableCell>{new Date(Number(t.date) / 1_000_000).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-[150px] truncate text-muted-foreground">{t.notes || '—'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(t.id)}
                            disabled={deleteTransaction.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>Update the transaction details below.</DialogDescription>
          </DialogHeader>
          {editingTransaction && (
            <div className="space-y-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(editingTransaction.transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Type</Label>
                <Select value={editPaymentType} onValueChange={setEditPaymentType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_TYPES.map((pt) => (
                      <SelectItem key={pt} value={pt}>{pt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingTransaction(null)}>Cancel</Button>
                <Button onClick={handleUpdate} disabled={updateTransaction.isPending}>
                  {updateTransaction.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
