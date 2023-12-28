import { Router } from 'express';

import { CreateSession } from '../controllers/SessionControllers';

const sessionRoutes = Router();

const createSession = new CreateSession();

sessionRoutes.post('/', createSession.create);

export { sessionRoutes };
