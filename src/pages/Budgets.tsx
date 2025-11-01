import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trash2 } from 'lucide-react';
import { BudgetForm } from '@/components/forms/BudgetForm';
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
import { useBudgets, useDeleteBudget } from '@/hooks/useApi';

export default function Budgets() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);

  const { data: budgets = [], isLoading } = useBudgets();
  const deleteBudget = useDeleteBudget();

  const handleDelete = async () => {
    if (!budgetToDelete) return;

    try {
      await deleteBudget.mutateAsync(budgetToDelete);
      toast.success('Budget supprimé avec succès');
      setDeleteDialogOpen(false);
      setBudgetToDelete(null);
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
            <h1 className="text-3xl font-bold">Budgets</h1>
            <p className="text-muted-foreground">Suivez vos objectifs financiers</p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-primary-glow"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Budget
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;

            return (
              <Card key={budget.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-warning" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setBudgetToDelete(budget.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Dépensé</span>
                      <span className={isOverBudget ? 'text-destructive font-semibold' : ''}>
                        {budget.spent.toLocaleString()} Ar / {budget.amount.toLocaleString()} Ar
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {percentage.toFixed(0)}% utilisé
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{budget.period}</span>
                    <span className="text-muted-foreground">
                      {budget.category?.name || 'Toutes catégories'}
                    </span>
                  </div>
                  {isOverBudget && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
                      <p className="text-xs text-destructive font-medium">
                        Budget dépassé de {(budget.spent - budget.amount).toLocaleString()} Ar
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          {budgets.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Aucun budget trouvé</p>
                <Button variant="outline" onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre premier budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <BudgetForm
          open={formOpen}
          onOpenChange={setFormOpen}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce budget ? Cette action est irréversible.
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
