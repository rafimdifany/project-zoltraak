export type UserRole = 'USER' | 'PREMIUM' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
