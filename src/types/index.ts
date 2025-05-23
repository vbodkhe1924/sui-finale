export interface Participant {
  id: string;
  name: string;
  walletAddress: string;
  amount: number;
  expenses: Expense[];
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  merchant?: string;
  category?: string;
  date?: string;
  participants: string[];
  payer?: string;
  settled?: boolean;
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