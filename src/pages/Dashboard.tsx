import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAccounts, useTransactions, useBudgets } from '@/hooks/useApi';
import { useMemo } from 'react';
import { ExpenseByCategoryChart } from '@/components/charts/ExpenseByCategoryChart';
import { MonthlyIncomeExpensesChart } from '@/components/charts/MonthlyIncomeExpensesChart';
import { SavingsTrendChart } from '@/components/charts/SavingsTrendChart';

export default function Dashboard() {
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();

  const isLoading = accountsLoading || transactionsLoading || budgetsLoading;

  // Calculate statistics from raw data
  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.transactionDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      accountCount: accounts.length,
      transactionCount: transactions.length,
      budgetCount: budgets.length,
    };
  }, [accounts, transactions, budgets]);

  // Group transactions by category
  const categoryStats = useMemo(() => {
    const categoryMap = new Map<string, { name: string; amount: number; count: number; type: string }>();

    transactions.forEach(t => {
      if (!t.category) return;

      // Use category ID + type as key to separate income and expenses
      const key = `${t.category.id}-${t.type}`;
      const existing = categoryMap.get(key);

      if (existing) {
        existing.amount += t.amount;
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          name: t.category.name,
          amount: t.amount,
          count: 1,
          type: t.type,
        });
      }
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5);
  }, [transactions]);

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
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble de vos finances</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solde Total</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBalance.toLocaleString()} Ar</div>
              <p className="text-xs text-muted-foreground">{stats.accountCount} comptes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-success/5 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+{stats.totalIncome.toLocaleString()} Ar</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-destructive/5 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">-{stats.totalExpenses.toLocaleString()} Ar</div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-warning/5 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budgets</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.budgetCount}</div>
              <p className="text-xs text-muted-foreground">Actifs</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Statistiques du Mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nombre de transactions</span>
                  <span className="font-semibold">{stats.transactionCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Épargne nette</span>
                  <span className={`font-semibold ${stats.netSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stats.netSavings.toLocaleString()} Ar
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux d'épargne</span>
                  <span className="font-semibold text-success">
                    {stats.savingsRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Catégories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryStats.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-sm text-muted-foreground">{cat.count} transactions</p>
                    </div>
                    <p className={`font-semibold ${cat.type === 'INCOME' ? 'text-success' : 'text-destructive'}`}>
                      {cat.type === 'INCOME' ? '+' : '-'}{cat.amount.toLocaleString()} Ar
                    </p>
                  </div>
                ))}
                {categoryStats.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Aucune donnée disponible</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 lg:grid-cols-2">
          <MonthlyIncomeExpensesChart transactions={transactions} />
          <SavingsTrendChart transactions={transactions} />
        </div>

        <div className="grid gap-4">
          <ExpenseByCategoryChart categoryStats={categoryStats} />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Comptes Récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts.slice(0, 5).map((account) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.type}</p>
                    </div>
                    <p className="font-semibold">{account.balance.toLocaleString()} {account.currency}</p>
                  </div>
                ))}
                {accounts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Aucun compte</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${
                        transaction.type === 'INCOME' ? 'text-success' : 'text-destructive'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {transaction.amount.toLocaleString()} Ar
                    </p>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Aucune transaction</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
