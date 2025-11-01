// API Types matching Spring Boot backend

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Account {
  id: number;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH';
  balance: number;
  currency: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string;
  transactionDate: string;
  accountId?: number;
  categoryId?: number;
  userId?: number;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
}

export interface Budget {
  id: number;
  name: string;
  amount: number;
  spent: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  categoryId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Auth DTOs
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Backend response format (data contains everything)
export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Create/Update DTOs
export interface CreateAccountRequest {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH';
  balance: number;
  currency: string;
}

export interface CreateTransactionRequest {
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  description: string;
  transactionDate: string;
  accountId: number;
  categoryId: number;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  startDate: string;
  endDate: string;
  categoryId: number;
}

export interface CreateCategoryRequest {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color: string;
  icon: string;
}

// Dashboard Analytics Types
export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  accountCount: number;
  transactionCount: number;
  budgetCount: number;
  savingsRate: number;
}

export interface CategoryStatistics {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  type: 'INCOME' | 'EXPENSE';
}

export interface MonthlyTrend {
  month: string;
  year: number;
  income: number;
  expenses: number;
  netSavings: number;
}

export interface PeriodComparison {
  currentPeriodIncome: number;
  previousPeriodIncome: number;
  incomeChange: number;
  incomeChangePercentage: number;
  currentPeriodExpenses: number;
  previousPeriodExpenses: number;
  expenseChange: number;
  expenseChangePercentage: number;
  currentPeriodSavings: number;
  previousPeriodSavings: number;
  savingsChange: number;
  savingsChangePercentage: number;
}

// Savings Goals Types
export interface Goal {
  id: number;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  goalId: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  daysRemaining: number;
  requiredMonthlySavings: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'ACHIEVED';
}

export interface CreateGoalRequest {
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
}

export interface UpdateGoalProgressRequest {
  amount: number;
}
