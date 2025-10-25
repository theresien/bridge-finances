import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { Budget } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Target } from 'lucide-react';

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const data = await apiService.getBudgets();
        setBudgets(data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
  }, []);

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
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Budget
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100;
            const isOverBudget = percentage > 100;

            return (
              <Card key={budget.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.name}</CardTitle>
                    <Target className="h-5 w-5 text-warning" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Dépensé</span>
                      <span className={isOverBudget ? 'text-destructive font-semibold' : ''}>
                        {budget.spent.toFixed(2)} € / {budget.amount.toFixed(2)} €
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
                        ⚠️ Budget dépassé de {(budget.spent - budget.amount).toFixed(2)} €
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
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer votre premier budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
