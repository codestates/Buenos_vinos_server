import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { Wine } from '../entity/Wine';


class WineController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const wines = await Wine.find({
            select:["id", "wine", "wine_kr", "image", "body", "sweet", "acidic", "alcohol_content", "winery", "content", "rating_sum","rating_count", "rating"]
        });
        res.json(wines);
    };


}

export default WineController;