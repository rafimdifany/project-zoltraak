export interface Category {
  id: string;
  userId: string | null;
  parentId: string | null;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  subcategories: Category[];
}

export interface CategoryPayload {
  id: string;
  name: string;
  parentId: string | null;
  type?: 'INCOME' | 'EXPENSE';
}
