
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'PAID' | 'PENDING';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER';
export type RecurringFrequency = 'NONE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type PlanType = 'free' | 'pro';
export type AccountType = 'CHECKING' | 'SAVINGS' | 'WALLET' | 'INVESTMENT';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: PlanType;
  createdAt: string;
}

export interface Category {
  id: string;
  userId?: string; 
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  userId: string;
  seriesId?: string | null;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  frequency?: RecurringFrequency;
  installments?: number;
  notes?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: AccountType;
  color?: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  categoryIds?: string[];
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: 'FIXED_INCOME' | 'STOCKS' | 'FUNDS' | 'CRYPTO';
  initialAmount: number;
  currentAmount: number;
  monthlyAport: number;
  expectedReturn: number;
}

export interface AppConfig {
  theme: 'light' | 'dark';
  fontFamily: string;
  language: string;
  currency: string;
  privacyMode: boolean;
  notifications: boolean;
}
