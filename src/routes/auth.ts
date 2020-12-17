import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();
//Login route
router.post('/login', AuthController.login);

//Change my password
router.post('/changepw', [checkJwt], AuthController.changePassword);

router.get('/', [checkJwt], AuthController.islogined)

export default router;