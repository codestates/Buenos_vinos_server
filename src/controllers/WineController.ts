import { Request, Response } from 'express';
import { getRepository, MoreThanOrEqual, Not, LessThan, LessThanOrEqual, Between, createQueryBuilder} from 'typeorm';
import { validate } from 'class-validator';

import { Wine } from '../entity/Wine';


class WineController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const wines = await getRepository(Wine)
            .createQueryBuilder("wine")
            .leftJoinAndSelect("wine.type", "type")
            .leftJoinAndSelect("wine.country", "country")
            .leftJoinAndSelect("wine.food", "food")
            .getMany()
        
        res.json(wines);
    };

    static filteringWine = async (req: Request, res: Response) => {
        const max_sweet = req.query.sweet_max
        const min_sweet = req.query.sweet_min
        const min_acidic = req.query.acidic_min
        const max_acidic = req.query.acidic_max
        const min_body = req.query.body_min
        const max_body = req.query.body_max
        const type = req.query.type
        const country = req.query.country
        const rating = req.query.rating
        const food = req.query.food

        
        const filteredWine = await getRepository(Wine)
            .createQueryBuilder("wine")
            .leftJoinAndSelect("wine.type", "type")
            .leftJoinAndSelect("wine.country", "country")
            .leftJoinAndSelect("wine.food", "food")
            .andWhere(min_sweet ? 'wine.sweet >= :min_sweet' : '1=1' , { min_sweet: min_sweet})
            .andWhere(max_sweet ? 'wine.sweet <= :max_sweet' : '1=1' , { max_sweet: max_sweet })
            .andWhere(min_acidic ? 'wine.acidic >= :min_acidic' : '1=1' , { min_acidic: min_acidic})
            .andWhere(max_acidic ? 'wine.acidic <= :max_acidic' : '1=1', { max_acidic: max_acidic })
            .andWhere(min_body ? 'wine.body >= :min_body' : '1=1' , { min_body: min_body})
            .andWhere(max_body ? 'wine.body <= :max_body' : '1=1' , { max_body: max_body })
            .andWhere(type ? 'type.name = :t' : '1=1' , { t: type })
            .andWhere(country ? 'country.name = :c' : '1=1', {c: country})
            .andWhere(rating ? 'wine.rating >= :rating' : '1=1' , { rating: rating })
            .andWhere(food ? 'food.name IN (:...f)' : '1=1', { f: food })
            .getMany()


        res.json(filteredWine)
    }
}

export default WineController;