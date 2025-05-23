export interface Participant {
  id: string;
  name: string;
  walletAddress: string;
  amount: number;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: string;
  description: string;
  merchant: string;
  participants: string[];
}

export type ExpenseCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Entertainment'
  | 'Utilities & Bills'
  | 'Shopping'
  | 'Healthcare'
  | 'Travel'
  | 'Other';