import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import { assetIdSchema, createAssetSchema, updateAssetSchema } from './asset.schema';
import {
  createAssetHandler,
  deleteAssetHandler,
  listAssetsHandler,
  updateAssetHandler
} from './asset.controller';

const router = Router();

router.get('/', listAssetsHandler);
router.post('/', validateRequest({ body: createAssetSchema }), createAssetHandler);
router.put(
  '/:id',
  validateRequest({ params: assetIdSchema, body: updateAssetSchema }),
  updateAssetHandler
);
router.delete('/:id', validateRequest({ params: assetIdSchema }), deleteAssetHandler);

export { router as assetsRouter };
