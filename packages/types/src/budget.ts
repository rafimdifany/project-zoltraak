export interface Budget {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetWithProgress extends Budget {
  spent: number;
}
