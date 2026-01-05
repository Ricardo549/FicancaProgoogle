
import React from 'react';
import { Category, TransactionType } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Salário', icon: '💰', color: '#10b981', type: 'INCOME' },
  { id: '2', name: 'Investimentos', icon: '📈', color: '#3b82f6', type: 'INCOME' },
  { id: '3', name: 'Extras', icon: '🎁', color: '#f59e0b', type: 'INCOME' },
  { id: '4', name: 'Aluguel/Moradia', icon: '🏠', color: '#ef4444', type: 'EXPENSE' },
  { id: '5', name: 'Alimentação', icon: '🍕', color: '#f97316', type: 'EXPENSE' },
  { id: '6', name: 'Transporte', icon: '🚗', color: '#6366f1', type: 'EXPENSE' },
  { id: '7', name: 'Lazer', icon: '🎮', color: '#ec4899', type: 'EXPENSE' },
  { id: '8', name: 'Saúde', icon: '🏥', color: '#06b6d4', type: 'EXPENSE' },
  { id: '9', name: 'Educação', icon: '📚', color: '#8b5cf6', type: 'EXPENSE' },
];

export const INITIAL_ACCOUNTS = [
  { id: 'acc1', name: 'Banco Principal', balance: 5000, type: 'CHECKING' },
  { id: 'acc2', name: 'Reserva de Emergência', balance: 15000, type: 'SAVINGS' },
  { id: 'acc3', name: 'Carteira', balance: 250, type: 'WALLET' },
];

export const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];
