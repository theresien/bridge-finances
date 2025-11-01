import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMemo } from 'react';
import { Transaction } from '@/types/api';

interface SavingsTrendChartProps {
  transactions: Transaction[];
}

const chartConfig = {
  savings: {
    label: 'Épargne',
    color: '#8b5cf6',
  },
  cumulative: {
    label: 'Cumulative',
    color: '#06b6d4',
  },
};

export function SavingsTrendChart({ transactions }: SavingsTrendChartProps) {
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

    let cumulative = 0;
    return Array.from(monthlyData.entries()).map(([month, data]) => {
      const savings = data.income - data.expenses;
      cumulative += savings;
      return {
        month,
        savings,
        cumulative,
      };
    });
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendance d'Épargne (6 derniers mois)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
            <Line
              type="monotone"
              dataKey="savings"
              stroke="var(--color-savings)"
              strokeWidth={3}
              dot={{ r: 5, fill: 'var(--color-savings)' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="var(--color-cumulative)"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 5, fill: 'var(--color-cumulative)' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
