import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag } from 'lucide-react';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { useCategories } from '@/hooks/useApi';

export default function Categories() {
  const [formOpen, setFormOpen] = useState(false);
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Catégories</h1>
            <p className="text-muted-foreground">Organisez vos transactions</p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-primary-glow"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Catégorie
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                Revenus ({incomeCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {incomeCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <span style={{ color: category.color }}>{category.icon}</span>
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="outline" className="border-success text-success">
                      {category.type}
                    </Badge>
                  </div>
                ))}
                {incomeCategories.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune catégorie de revenu
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive"></div>
                Dépenses ({expenseCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expenseCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <span style={{ color: category.color }}>{category.icon}</span>
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Badge variant="outline" className="border-destructive text-destructive">
                      {category.type}
                    </Badge>
                  </div>
                ))}
                {expenseCategories.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune catégorie de dépense
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucune catégorie trouvée</p>
              <Button variant="outline" onClick={() => setFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer votre première catégorie
              </Button>
            </CardContent>
          </Card>
        )}

        <CategoryForm
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      </div>
    </DashboardLayout>
  );
}
