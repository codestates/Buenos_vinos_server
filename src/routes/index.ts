import { Router, Request, Response } from 'express';
import auth from './auth';
import user from './user';
import wine from './wine';
import comment from './comment';
import { checkJwt } from '../middlewares/checkJwt';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
    res.json('hello world');
});

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/wine', wine);
routes.use('/comment', comment)

export default routes;