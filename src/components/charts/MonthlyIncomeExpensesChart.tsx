import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMemo } from 'react';
import { Transaction } from '@/types/api';

interface MonthlyIncomeExpensesChartProps {
  transactions: Transaction[];
}

const chartConfig = {
  income: {
    label: 'Revenus',
    color: '#10b981',
  },
  expenses: {
    label: 'Dépenses',
    color: '#ef4444',
  },
};

export function MonthlyIncomeExpensesChart({ transactions }: MonthlyIncomeExpensesChartProps) {
  const chartData = useMemo(() => {
    const monthlyData = new Map<string, { income: number; expenses: number }>();

    // Get last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      monthlyData.set(key, { income: 0, expenses: 0 });
    }

    // Aggregate transactions by month
    transactions.forEach((t) => {
      const date = new Date(t.transactionDate);
      const key = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

      const existing = monthlyData.get(key);
      if (existing) {
        if (t.type === 'INCOME') {
          existing.income += t.amount;
        } else if (t.type === 'EXPENSE') {
          existing.expenses += t.amount;
        }
      }
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }));
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenus vs Dépenses (6 derniers mois)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value).toLocaleString()} Ar`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
