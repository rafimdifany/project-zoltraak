import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import {
  createTransactionSchema,
  transactionIdSchema,
  updateTransactionSchema
} from './transaction.schema';
import {
  createTransactionHandler,
  deleteTransactionHandler,
  listTransactionsHandler,
  updateTransactionHandler
} from './transaction.controller';

const router = Router();

router.get('/', listTransactionsHandler);
router.post('/', validateRequest({ body: createTransactionSchema }), createTransactionHandler);
router.put(
  '/:id',
  validateRequest({ params: transactionIdSchema, body: updateTransactionSchema }),
  updateTransactionHandler
);
router.delete('/:id', validateRequest({ params: transactionIdSchema }), deleteTransactionHandler);

export { router as transactionRouter };
