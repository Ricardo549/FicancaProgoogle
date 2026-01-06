
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'PAID' | 'PENDING';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER';
export type RecurringFrequency = 'NONE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  categoryId: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  frequency?: RecurringFrequency;
  lastGeneratedDate?: string;
  installments?: number;
  currentInstallment?: number;
  notes?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'CHECKING' | 'SAVINGS' | 'WALLET';
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'FIXED_INCOME' | 'STOCKS' | 'FUNDS' | 'CRYPTO';
  initialAmount: number;
  currentAmount: number;
  monthlyAport: number;
  expectedReturn: number; // yearly %
}

export interface CreditSimulation {
  amount: number;
  interestRate: number; // yearly %
  periodMonths: number;
  method: 'SAC' | 'PRICE';
}
