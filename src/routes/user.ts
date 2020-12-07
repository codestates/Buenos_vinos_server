import { Router } from 'express';
import UserController from '../controllers/UserController';
import { checkJwt } from '../middlewares/checkJwt';
const router = Router();



// Get one user
router.get('/', [checkJwt], UserController.getOneById);

//Create a new user
router.post('/', UserController.newUser);

//Edit one user
router.patch('/', [checkJwt], UserController.editUser);

//Delete one user
router.delete('/', [checkJwt], UserController.deleteUser);

//logout userauthorization
router.get('/logout', UserController.logoutUser)

export default router;