import { Router } from 'express';

import { requireAuth } from '../middleware/require-auth';
import { authRouter } from '../modules/auth';
import { assetsRouter } from '../modules/asset';
import { budgetRouter } from '../modules/budget';
import { dashboardRouter } from '../modules/dashboard';
import { transactionRouter } from '../modules/transaction';

const router = Router();

router.use('/auth', authRouter);
router.use('/transactions', requireAuth, transactionRouter);
router.use('/budgets', requireAuth, budgetRouter);
router.use('/assets', requireAuth, assetsRouter);
router.use('/dashboard', requireAuth, dashboardRouter);

export { router as apiRouter };
