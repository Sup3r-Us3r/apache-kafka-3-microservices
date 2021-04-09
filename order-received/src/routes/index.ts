import { Router } from 'express';
import appRoutes from './app.routes';

const routes = Router();

routes.use('/app', appRoutes);

export default routes;
