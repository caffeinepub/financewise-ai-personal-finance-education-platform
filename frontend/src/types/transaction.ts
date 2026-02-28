import type { Principal } from '@icp-sdk/core/principal';

// Local Transaction type definition since it's not exported from backend
export interface Transaction {
  id: string;
  amount: number;
  category: string;
  notes: string;
  date: bigint;
  paymentType: string;
  user: Principal;
  createdAt: bigint;
  transactionType: string;
}
