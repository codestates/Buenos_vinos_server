import { Router } from 'express';
import CommentController from '../controllers/CommentController'
import { checkJwt } from '../middlewares/checkJwt';
const router = Router();

//코멘트 작성
router.post('/', [checkJwt], CommentController.createComment)

//코멘트 수정
router.patch('/', [checkJwt], CommentController.editComment)

//코멘트 삭제
router.delete('/', [checkJwt], CommentController.deleteComment)


export default router;