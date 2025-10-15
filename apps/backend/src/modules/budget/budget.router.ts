import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import { budgetIdSchema, createBudgetSchema, updateBudgetSchema } from './budget.schema';
import {
  createBudgetHandler,
  deleteBudgetHandler,
  listBudgetsHandler,
  updateBudgetHandler
} from './budget.controller';

const router = Router();

router.get('/', listBudgetsHandler);
router.post('/', validateRequest({ body: createBudgetSchema }), createBudgetHandler);
router.put(
  '/:id',
  validateRequest({ params: budgetIdSchema, body: updateBudgetSchema }),
  updateBudgetHandler
);
router.delete('/:id', validateRequest({ params: budgetIdSchema }), deleteBudgetHandler);

export { router as budgetRouter };
