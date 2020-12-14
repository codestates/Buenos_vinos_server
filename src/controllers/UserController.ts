import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

import { User } from '../entity/User';

class UserController {
    //
    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        const users = await User.find({
            select: ['id', 'email'], //We dont want to send the passwords on response
        });

        //Send the users object
        res.json(users);
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.cookies.userId
        
        const userInfo = await getRepository(User)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.comment", "comment")
            .leftJoinAndSelect("comment.wine", "winecomment")
            .leftJoinAndSelect("user.wishlist", "wishlist")
            .leftJoinAndSelect("wishlist.type", "type")
            .leftJoinAndSelect("wishlist.country", "country")
            .leftJoinAndSelect("wishlist.food", "food")
            .andWhere('user.id = :id', { id: id })
            .select('user.id')
            .addSelect('user.email')
            .addSelect('user.nickname')
            .addSelect('comment')
            .addSelect('winecomment')
            .addSelect('wishlist.id')
            .addSelect('wishlist.name')
            .addSelect('wishlist.name_en')
            .addSelect('wishlist.image')
            .addSelect('wishlist.body')
            .addSelect('wishlist.sweet')
            .addSelect('wishlist.acidic')
            .addSelect('wishlist.alcohol_content')
            .addSelect('wishlist.winery')
            .addSelect('wishlist.content')
            .addSelect('wishlist.rating_sum')
            .addSelect('wishlist.rating_count')
            .addSelect('wishlist.rating')
            .addSelect('comment.wine')
            .addSelect('type.name')
            .addSelect('country.name')
            .addSelect('food.name')
            .getOne()
        
        res.json(userInfo)
    };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { email, password, nickname, google, facebook, kakao } = req.body;
        let user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.google = google;
        user.facebook = facebook;
        user.kakao = kakao


        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        try {
            //Try to save. If fails, the username is already in use
            await User.save(user);
        } catch (e) {
            res.status(409).json('이미 존재하는 별명입니다');
            return;
        }

        //If all ok, send 201 response
        res.status(201).json('User created');
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the cookie
        const id = req.cookies.userId;

        //Get values from the body
        const { nickname } = req.body;

        let user;
        //Try to find user on database
        
            user = await User.findOneOrFail(id);
         

        //Validate the new values on model
        user.nickname = nickname;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await User.save(user);
        } catch (e) {
            res.status(409).json('이미 존재하는 별명입니다');
            return;
        }
        //After all send a 204 (no content, but accepted) response 204로 보내면 res.json이 안간다
        // res.status(204).json('정보가 업데이트 되었습니다');
        res.status(200).json('유저 정보가 변경되었습니다')
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.cookies.userId;

        let user: User;
        try {
            user = await User.findOneOrFail(id);
        } catch (error) {
            res.status(404).json('User not found');
            return;
        }
        User.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json('유저정보가 삭제되었습니다');
    };

    // static logoutUser = async (req: Request, res: Response) => {

    //     let user: User

    //     res.clearCookie('authorization')
    //     res.clearCookie('userId')
    //     res.redirect("/")
    //     // res.status(200).send('logout OK')
        
    // };
}

export default UserController;