import { Request, Response } from 'express';
import { getRepository, MoreThanOrEqual, Not, LessThan, LessThanOrEqual, Between} from 'typeorm';
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

    static filteringWine = async (req: Request, res: Response) => {
        const max_sweet = req.query.sweet_max
        const min_sweet = req.query.sweet_min
        const min_acidic = req.query.acidic_min
        const max_acidic = req.query.acidic_max
        const min_body = req.query.body_min
        const max_body = req.query.body_max

        
        const filteredWine = await getRepository(Wine).find({
            where: {
                sweet: Between(min_sweet, max_sweet),
                acidic: Between(min_acidic, max_acidic),
                body: Between(min_body, max_body)
            }
        })
        res.json(filteredWine)
    }
}

export default WineController;