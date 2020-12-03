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

        
        const filteredWine = await getRepository(Wine)
            .createQueryBuilder("wine")
            .leftJoinAndSelect("wine.type", "type")
            .leftJoinAndSelect("wine.country", "country")
            .andWhere('wine.sweet >= :min_sweet', { min_sweet: min_sweet})
            .andWhere('wine.sweet <= :max_sweet', { max_sweet: max_sweet })
            .andWhere('wine.acidic >= :min_acidic', { min_acidic: min_acidic})
            .andWhere('wine.acidic <= :max_acidic', { max_acidic: max_acidic })
            .andWhere('wine.body >= :min_body', { min_body: min_body})
            .andWhere('wine.body <= :max_body', { max_body: max_body })
            .andWhere('type.type = :type', { type: type })
            .andWhere('country.country = :country', {country: country})
            // .andWhere('wine.rating => :rating', {rating: rating})
            .getMany()


        res.json(filteredWine)
    }
}

export default WineController;