import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { Comment } from '../entity/Comment'

class CommentController {

    static createComment = async (req: Request, res: Response) => {
        let { comment, rating } = req.body
        
        

    }


 }

export default CommentController;