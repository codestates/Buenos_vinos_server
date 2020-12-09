import { Router } from 'express';
import WineController from '../controllers/WineController';
import { checkJwt } from '../middlewares/checkJwt';
const router = Router();

router.post('/wishlist/:id', [checkJwt], WineController.addWishlist);

router.delete('/wishlist/:id', [checkJwt], WineController.deleteWishlist);

router.get('/', WineController.filteringWine)

export default router;