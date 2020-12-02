import { Router } from 'express';
import WineController from '../controllers/WineController';

const router = Router();

router.get('/', WineController.listAll);

router.get('/filter', WineController.filteringWine)

export default router;