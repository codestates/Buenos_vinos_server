import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();
//Login route
router.post('/login', AuthController.login);

router.post('/login/google', AuthController.googlelogin)

//Change my password
router.post('/changepw', [checkJwt], AuthController.changePassword);

export default router;