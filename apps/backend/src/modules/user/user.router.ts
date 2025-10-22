import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import { updateCurrencySchema } from './user.schema';
import { updateCurrencyHandler } from './user.controller';

const router = Router();

router.put(
  '/currency',
  validateRequest({ body: updateCurrencySchema }),
  updateCurrencyHandler
);

export { router as userRouter };
