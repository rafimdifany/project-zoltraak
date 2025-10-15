import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import { dashboardOverviewHandler } from './dashboard.controller';
import { dashboardQuerySchema } from './dashboard.schema';

const router = Router();

router.get('/', validateRequest({ query: dashboardQuerySchema }), dashboardOverviewHandler);

export { router as dashboardRouter };
