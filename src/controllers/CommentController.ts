import { Request, Response } from 'express';
import { getRepository, getConnection, getManager } from 'typeorm';
import { validate } from 'class-validator';

import { Comment } from '../entity/Comment'
import { Wine } from '../entity/Wine';

class CommentController {

    static createComment = async (req: Request, res: Response) => {
        const userId = req.cookies.userId
        const WineManager = getManager();

        let { content, rating, wineId } = req.body

        //와인 레이팅값 업데이트
        await WineManager.increment(Wine, {id: wineId}, "rating_sum", rating);
        await WineManager.increment(Wine, {id: wineId}, "rating_count", 1);
        

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


    static editComment = async (req: Request, res: Response) => { 
        let {content, rating, commentId} = req.body

        let comment;
        const WineManager = getManager();
        const CommentManager = getManager();

        comment = await getRepository(Comment)
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.wine", "wine")
            .andWhere('comment.id = :id', { id: commentId })
            .getOne()
        
        
        await WineManager.decrement(Wine, {id: comment.wine.id}, "rating_sum", comment.rating);
        await WineManager.decrement(Wine, {id: comment.wine.id}, "rating_count", 1);

        await CommentManager.update(Comment, { id: commentId }, { content: content })
        await CommentManager.update(Comment, {id: commentId}, {rating: rating})

        await WineManager.increment(Wine, {id: comment.wine.id}, "rating_sum", rating);
        await WineManager.increment(Wine, {id: comment.wine.id}, "rating_count", 1);
        
        const errors = await validate(comment);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        res.status(200).json(comment)
    }

    static deleteComment = async (req: Request, res: Response) => {
        let { commentId } = req.body
        
        let comment;
        const WineManager = getManager();

        comment = await getRepository(Comment)
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.wine", "wine")
            .andWhere('comment.id = :id', { id: commentId })
            .getOne()
        
        await WineManager.decrement(Wine, {id: comment.wine.id}, "rating_sum", comment.rating);
        await WineManager.decrement(Wine, {id: comment.wine.id}, "rating_count", 1);
        
        Comment.delete(commentId)

        res.status(200).json('코멘트가 삭제되었습니다');
     }
 }

export default CommentController;