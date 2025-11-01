import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import {
  Account,
  Transaction,
  Budget,
  Category,
  Goal,
  DashboardSummary,
  CategoryStatistics,
  MonthlyTrend,
  CreateAccountRequest,
  CreateTransactionRequest,
  CreateBudgetRequest,
  CreateCategoryRequest,
  CreateGoalRequest,
  UpdateGoalProgressRequest,
} from '@/types/api';

// Query Keys
export const queryKeys = {
  accounts: ['accounts'] as const,
  account: (id: number) => ['accounts', id] as const,
  transactions: ['transactions'] as const,
  transaction: (id: number) => ['transactions', id] as const,
  budgets: ['budgets'] as const,
  budget: (id: number) => ['budgets', id] as const,
  categories: ['categories'] as const,
  category: (id: number) => ['categories', id] as const,
  goals: ['goals'] as const,
  goal: (id: number) => ['goals', id] as const,
  goalProgress: (id: number) => ['goals', id, 'progress'] as const,
  activeGoals: ['goals', 'active'] as const,
  completedGoals: ['goals', 'completed'] as const,
  dashboardSummary: (period?: string) => ['dashboard', 'summary', period] as const,
  categoryStatistics: (period?: string, type?: 'INCOME' | 'EXPENSE') =>
    ['dashboard', 'categoryStats', period, type] as const,
  monthlyTrends: (months?: number) => ['dashboard', 'monthlyTrends', months] as const,
};

// ============= ACCOUNTS =============

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => apiService.getAccounts(),
  });
}

export function useAccount(id: number) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => apiService.getAccount(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountRequest) => apiService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAccountRequest> }) =>
      apiService.updateAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.account(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
    },
  });
}

// ============= TRANSACTIONS =============

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => apiService.getTransactions(),
  });
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => apiService.getTransaction(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => apiService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categoryStatistics() });
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyTrends() });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTransactionRequest> }) =>
      apiService.updateTransaction(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categoryStatistics() });
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyTrends() });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
      queryClient.invalidateQueries({ queryKey: queryKeys.categoryStatistics() });
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyTrends() });
    },
  });
}

// ============= BUDGETS =============

export function useBudgets() {
  return useQuery({
    queryKey: queryKeys.budgets,
    queryFn: () => apiService.getBudgets(),
  });
}

export function useBudget(id: number) {
  return useQuery({
    queryKey: queryKeys.budget(id),
    queryFn: () => apiService.getBudget(id),
    enabled: !!id,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => apiService.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateBudgetRequest> }) =>
      apiService.updateBudget(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary() });
    },
  });
}

// ============= CATEGORIES =============

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => apiService.getCategories(),
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => apiService.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => apiService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCategoryRequest> }) =>
      apiService.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.category(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

// ============= GOALS =============

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: () => apiService.getGoals(),
  });
}

export function useGoal(id: number) {
  return useQuery({
    queryKey: queryKeys.goal(id),
    queryFn: () => apiService.getGoal(id),
    enabled: !!id,
  });
}

export function useGoalProgress(id: number) {
  return useQuery({
    queryKey: queryKeys.goalProgress(id),
    queryFn: () => apiService.getGoalProgress(id),
    enabled: !!id,
  });
}

export function useActiveGoals() {
  return useQuery({
    queryKey: queryKeys.activeGoals,
    queryFn: () => apiService.getActiveGoals(),
  });
}

export function useCompletedGoals() {
  return useQuery({
    queryKey: queryKeys.completedGoals,
    queryFn: () => apiService.getCompletedGoals(),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalRequest) => apiService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeGoals });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGoalRequest> }) =>
      apiService.updateGoal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.goal(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goalProgress(variables.id) });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeGoals });
      queryClient.invalidateQueries({ queryKey: queryKeys.completedGoals });
    },
  });
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGoalProgressRequest }) =>
      apiService.updateGoalProgress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.goal(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goalProgress(variables.id) });
    },
  });
}

export function useCompleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.completeGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeGoals });
      queryClient.invalidateQueries({ queryKey: queryKeys.completedGoals });
    },
  });
}

export function useCancelGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.cancelGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals });
      queryClient.invalidateQueries({ queryKey: queryKeys.activeGoals });
    },
  });
}

// ============= DASHBOARD =============

export function useDashboardSummary(period?: string, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.dashboardSummary(period),
    queryFn: () => apiService.getDashboardSummary(period),
    refetchInterval: options?.refetchInterval,
  });
}

export function useCategoryStatistics(period?: string, type?: 'INCOME' | 'EXPENSE') {
  return useQuery({
    queryKey: queryKeys.categoryStatistics(period, type),
    queryFn: () => apiService.getCategoryStatistics(period, type),
  });
}

export function useMonthlyTrends(months?: number) {
  return useQuery({
    queryKey: queryKeys.monthlyTrends(months),
    queryFn: () => apiService.getMonthlyTrends(months),
  });
}
