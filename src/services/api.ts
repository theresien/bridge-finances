import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  User,
  Account,
  CreateAccountRequest,
  Transaction,
  CreateTransactionRequest,
  Budget,
  CreateBudgetRequest,
  Category,
  CreateCategoryRequest
} from '@/types/api';

// Update this with your Spring Boot backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log(`API Request: ${options.method || 'GET'} ${API_BASE_URL}${endpoint}`);
    console.log('Request body:', options.body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      console.error('API Error:', error);
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('Login request:', credentials);
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('Login response:', response);

    this.token = response.data.token;
    localStorage.setItem('auth_token', response.data.token);

    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('Register request:', data);
    const response = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('Register response:', response);

    this.token = response.data.token;
    localStorage.setItem('auth_token', response.data.token);

    return response.data;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    const response = await this.request<ApiResponse<Account[]>>('/accounts');
    return response.data;
  }

  async getAccount(id: number): Promise<Account> {
    const response = await this.request<ApiResponse<Account>>(`/accounts/${id}`);
    return response.data;
  }

  async createAccount(data: CreateAccountRequest): Promise<Account> {
    const response = await this.request<ApiResponse<Account>>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateAccount(id: number, data: Partial<CreateAccountRequest>): Promise<Account> {
    const response = await this.request<ApiResponse<Account>>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteAccount(id: number): Promise<void> {
    await this.request(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    const response = await this.request<ApiResponse<any>>('/transactions');
    // Backend returns paginated data with { content: [], pageable: {...} }
    if (response.data && Array.isArray(response.data.content)) {
      return response.data.content;
    }
    // Fallback if it's a direct array
    return Array.isArray(response.data) ? response.data : [];
  }

  async getTransaction(id: number): Promise<Transaction> {
    const response = await this.request<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data;
  }

  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    const response = await this.request<ApiResponse<Transaction>>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateTransaction(id: number, data: Partial<CreateTransactionRequest>): Promise<Transaction> {
    const response = await this.request<ApiResponse<Transaction>>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget endpoints
  async getBudgets(): Promise<Budget[]> {
    const response = await this.request<ApiResponse<Budget[]>>('/budgets');
    return response.data;
  }

  async getBudget(id: number): Promise<Budget> {
    const response = await this.request<ApiResponse<Budget>>(`/budgets/${id}`);
    return response.data;
  }

  async createBudget(data: CreateBudgetRequest): Promise<Budget> {
    const response = await this.request<ApiResponse<Budget>>('/budgets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateBudget(id: number, data: Partial<CreateBudgetRequest>): Promise<Budget> {
    const response = await this.request<ApiResponse<Budget>>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteBudget(id: number): Promise<void> {
    await this.request(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('/categories');
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async updateCategory(id: number, data: Partial<CreateCategoryRequest>): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
