import { Request, Response } from 'express';
import { getRepository, MoreThanOrEqual, Not, LessThan, LessThanOrEqual, Between, createQueryBuilder, getConnection} from 'typeorm';
import { validate } from 'class-validator';

import { Wine } from '../entity/Wine';
import { User } from '../entity/User';


class WineController {

    static addWishlist = async (req: Request, res: Response) => {
        //Get users from database
        const wineId = req.params.id
        const userId = req.cookies.userId

        try{
        await getConnection()
            .createQueryBuilder()
            .relation(User, "wishlist")
            .of(userId)
            .add(wineId)
        } catch (e) {
            res.status(409).json('이미 위시리스트에 추가된 와인입니다')
            return;
        }

        res.status(201).json("위시리스트가 추가되었습니다.")
    };

    static deleteWishlist = async (req: Request, res: Response) => {
        const wineId = req.params.id
        const userId = req.cookies.userId

        await getConnection()
            .createQueryBuilder()
            .relation(User, "wishlist")
            .of(userId)
            .remove(wineId)
        
        
        
        res.status(201).json("위시리스트가 삭제되었습니다.")
     }

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
        const inpact :any = req.query.name

        var regExp4 = /^[가-힣]+$/

        let wine_kr = ''
        let wine_en = ''
        regExp4.test(inpact) ? wine_kr=inpact : wine_en=inpact
        
        const filteredWine = await getRepository(Wine)
            .createQueryBuilder("wine")
            .leftJoinAndSelect("wine.type", "type")
            .leftJoinAndSelect("wine.country", "country")
            .leftJoinAndSelect("wine.food", "food")
            .leftJoinAndSelect("wine.comment", "comment")
            .leftJoinAndSelect("comment.user", "user")
            .andWhere(wine_kr ? 'wine.name LIKE :name' : '1=1', { name: `%${wine_kr}%` })
            .andWhere(wine_en ? 'wine.name_en LIKE :name_en' : '1=1' , { name_en: `%${wine_en}%`})
            .andWhere(min_sweet ? 'wine.sweet >= :min_sweet' : '1=1' , { min_sweet: min_sweet})
            .andWhere(max_sweet ? 'wine.sweet <= :max_sweet' : '1=1' , { max_sweet: max_sweet })
            .andWhere(min_acidic ? 'wine.acidic >= :min_acidic' : '1=1' , { min_acidic: min_acidic})
            .andWhere(max_acidic ? 'wine.acidic <= :max_acidic' : '1=1', { max_acidic: max_acidic })
            .andWhere(min_body ? 'wine.body >= :min_body' : '1=1' , { min_body: min_body})
            .andWhere(max_body ? 'wine.body <= :max_body' : '1=1' , { max_body: max_body })
            .andWhere(type ? 'type.name IN (:...t)' : '1=1' , { t: type })
            .andWhere(country ? 'country.name IN (:...c)' : '1=1', {c: country})
            .andWhere(rating ? 'wine.rating >= :rating' : '1=1' , { rating: rating })
            .andWhere(food ? 'food.name IN (:...f)' : '1=1', { f: food })
            .select("wine")
            .addSelect("type")
            .addSelect("country")
            .addSelect("food")
            .addSelect("comment")
            .addSelect("user.id")
            .addSelect("user.nickname")
            .getMany()


        res.json(filteredWine)
    }
}

export default WineController;