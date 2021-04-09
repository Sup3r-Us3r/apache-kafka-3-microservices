import { Router } from 'express';
import AppController from '../app/controllers/AppController';

const appRoutes = Router();

appRoutes.post('/sendOrder', AppController.sendOrder);

export default appRoutes;
