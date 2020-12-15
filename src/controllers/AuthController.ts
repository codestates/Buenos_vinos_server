require('dotenv').config();
import { Request, Response } from 'express';
import { getRepository, getConnection, getManager } from 'typeorm';
import {OAuth2Client} from 'google-auth-library'
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import axios from 'axios';
import { User } from '../entity/User';



const jwtSecret = process.env.JWT_SECRET;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthController {
    //
    static login = async (req: Request, res: Response) => {
        //Check if email and password are set
        let { email, password} = req.body;
        if (!(email && password)) {
            res.status(400).json('bad request');
        }

        let user: User;
        try {
            // Get user from database
            user = await User.findOneOrFail({ where: { email } });
        } catch (error) {
            res.status(401).json('unauthorized');
        }

        //Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).json('unauthorized');
            return;
        }

        const userInfo = await getRepository(User)
            .createQueryBuilder("user")
                .leftJoinAndSelect("user.wishlist", "wishlist")
                .andWhere('user.email = :email', { email: email })
                .select("user.id")
                .addSelect('wishlist.id')
                .getOne()
        
        //Sing JWT, valid for 1 hour
        const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
            expiresIn: '1h',
        });
        let info = {
            userId: user.id,
            nickname: user.nickname,
            wishlist: userInfo.wishlist
        }
        //Send the jwt in the response
        res.cookie('authorization', token, { sameSite: "none", secure: true, httpOnly:true });
        console.log(user.id);
        res.cookie('userId', user.id, { sameSite: "none", secure: true, httpOnly: true });

        res.status(200).json(info)
    };

    static googlelogin = async (req: Request, res: Response) => { 
        let { tokenId } = req.body;

        const GoogleManager = getManager();

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            let email = payload.email
            let name = payload.name
            let user: User;
            
            // Get user from database
            

            const count = await GoogleManager.count(User, {email: email})

            if (count < 1) {
                let user = new User()
                user.email = payload.email;
                user.nickname = payload.name;
                                                
                await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .execute()
            }

            
            try{
                user = await User.findOneOrFail({ where: {email}});
            } catch (error) {
                res.status(401).json('아직 안만들어진거같은데?');
            }


            const jwttoken = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
                expiresIn: '1h',
            });

            const userInfo = await getRepository(User)
            .createQueryBuilder("user")
                .leftJoinAndSelect("user.wishlist", "wishlist")
                .andWhere('user.id = :id', { id: user.id })
                .select("user.id")
                .addSelect('wishlist.id')
                .getOne()

            
            let info = {
                userId: user.id,
                nickname: user.nickname,
                wishlist: userInfo
            }
            //Send the jwt in the response
            res.cookie('authorization', jwttoken, { maxAge: 3600000, sameSite: "none", secure: true, httpOnly:true });
            console.log(user.id);
            res.cookie('userId', user.id, { maxAge: 3600000, sameSite: "none", secure: true, httpOnly: true });
        
        res.status(200).json(info)
            

        }
        
        
          verify().catch(console.error);
    }

    static kakaologin = async (req: Request, res: Response) => {
        let { kakao, nickname } = req.body;
        const KakaoManager = getManager();

        // var axios = require('axios');
        var data = '';
        let email
        let kakaoNickname
        let user: User;


        var config: any= {
        method: 'get',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer {${kakao}}`
        },
            data : data
        };

        await axios(config)
            .then(res => {
                // console.log("잘 받아오냐이메일",res.data.kakao_account.email)
                email = res.data.kakao_account.email
                kakaoNickname = res.data.kakao_account.profile.nickname
                
            })
            .catch(function (error) {
            console.log(error);
            });
        
        const count = await KakaoManager.count(User, { email: email })
        
        if (count < 1) {
            
            let user = new User()
            user.email = email
            user.nickname = kakaoNickname

            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .execute()
            
        }

        try{
            user = await User.findOneOrFail({ where: { email } });
            console.log(user)
        } catch (error) {
            res.status(401).json('아직 안만들어진거같은데?');
        }


        const jwttoken = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
            expiresIn: '1h',
        });

        const userInfo = await getRepository(User)
            .createQueryBuilder("user")
                .leftJoinAndSelect("user.wishlist", "wishlist")
                .andWhere('user.id = :id', { id: user.id })
                .select("user.id")
                .addSelect('wishlist.id')
                .getOne()

            
            let info = {
                userId: user.id,
                nickname: user.nickname,
                wishlist: userInfo
            }
            //Send the jwt in the response
            res.cookie('authorization', jwttoken, { maxAge: 3600000, sameSite: "none", secure: true, httpOnly:true });
            console.log(user.id);
            res.cookie('userId', user.id, { maxAge: 3600000, sameSite: "none", secure: true, httpOnly: true });
        
        res.status(200).json(info)

     }

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = req.cookies.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).json('bad request');
        }

        let user: User;
        try {
            // Get user from the database
            user = await User.findOneOrFail(id);
        } catch (id) {
            res.status(401).json('unauthorized');
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).json('unauthorized');
            return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }
        //Hash the new password and save
        user.hashPassword();
        User.save(user);

        res.status(201).json('비밀번호가 변경되었습니다');
    };
}

export default AuthController;