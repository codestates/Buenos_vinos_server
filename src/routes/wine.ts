import { Router } from 'express';
import WineController from '../controllers/WineController';

const router = Router();

router.get('/all', WineController.listAll);

router.get('/', WineController.filteringWine)

export default router;