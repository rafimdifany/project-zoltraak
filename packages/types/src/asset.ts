export interface Asset {
  id: string;
  userId: string;
  name: string;
  category?: string | null;
  currentValue: number;
  createdAt: string;
  updatedAt: string;
}
