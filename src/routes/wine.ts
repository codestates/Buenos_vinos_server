import { Router } from 'express';
import WineController from '../controllers/WineController';

const router = Router();

router.get('/', WineController.listAll);

export default router;