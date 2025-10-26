import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { Transaction } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';
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
import { toast } from 'sonner';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await apiService.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await apiService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await apiService.deleteTransaction(transactionToDelete);
      toast.success('Transaction supprimée avec succès');
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
      fetchTransactions();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Gérez toutes vos transactions</p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-primary-glow"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Transaction
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toutes les Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{transaction.category?.name || 'Sans catégorie'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${
                          transaction.type === 'INCOME' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {transaction.amount.toFixed(2)} €
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.account?.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setTransactionToDelete(transaction.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Aucune transaction trouvée</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => setFormOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer votre première transaction
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <TransactionForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSuccess={fetchTransactions}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
