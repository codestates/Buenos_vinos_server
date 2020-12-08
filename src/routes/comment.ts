import { Router } from 'express';
import CommentController from '../controllers/CommentController'
import { checkJwt } from '../middlewares/checkJwt';
const router = Router();

//코멘트 작성
router.post('/', [checkJwt], CommentController.createComment)

//코멘트 수정
// router.post('/', [checkJwt],)

//코멘트 삭제
// router.post('/', [checkJwt],)


export default router;