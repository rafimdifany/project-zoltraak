import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema
} from './category.schema';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  listCategoriesHandler,
  updateCategoryHandler
} from './category.controller';

const router = Router();

router.get('/', listCategoriesHandler);
router.post('/', validateRequest({ body: createCategorySchema }), createCategoryHandler);
router.patch(
  '/:id',
  validateRequest({ params: categoryIdSchema, body: updateCategorySchema }),
  updateCategoryHandler
);
router.delete('/:id', validateRequest({ params: categoryIdSchema }), deleteCategoryHandler);

export { router as categoriesRouter };
