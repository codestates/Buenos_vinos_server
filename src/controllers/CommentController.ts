import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { Comment } from '../entity/Comment'

class CommentController {

    static createComment = async (req: Request, res: Response) => {
        const userId = req.cookies.userId
        

        let { content, rating, wineId } = req.body
        let comment = new Comment();
        comment.content = content
        comment.rating = rating
        comment.user = userId
        comment.wine = wineId

        const errors = await validate(comment);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        try {
            await Comment.save(comment);
        } catch (e) {
            res.status(409).json('문제가 있습니다?');
            return;
        }

        res.status(201).json('코멘트가 작성되었습니다.');
    }


 }

export default CommentController;