import type { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface UserPayload {
      id: string;
      role: UserRole;
      email: string;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
