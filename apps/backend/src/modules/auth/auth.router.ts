import { Router } from 'express';

import { validateRequest } from '../../middleware/validate-request';
import { loginSchema, registerSchema } from './auth.schema';
import { loginHandler, registerHandler } from './auth.controller';

const router = Router();

router.post('/register', validateRequest({ body: registerSchema }), registerHandler);
router.post('/login', validateRequest({ body: loginSchema }), loginHandler);

export { router as authRouter };
