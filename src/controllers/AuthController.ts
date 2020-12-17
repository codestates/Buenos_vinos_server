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
        let { email, password, google, kakao, facebookId, facebookToken } = req.body;
        let socialEmail
        if (google) {
            const GoogleManager = getManager();

            
                const ticket = await client.verifyIdToken({
                    idToken: google,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                
                const payload = ticket.getPayload();
                const userid = payload['sub'];
                socialEmail = payload.email
                let name = payload.name
                let user: User;
                
                // Get user from database
                
    
                const count = await GoogleManager.count(User, { email: socialEmail })
    
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
            
        } else if (kakao) { 
            const KakaoManager = getManager();


            var data = '';
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
                    socialEmail = res.data.kakao_account.email
                    kakaoNickname = res.data.kakao_account.profile.nickname
                    
                })
                .catch(function (error) {
                console.log(error);
                });
            
            const count = await KakaoManager.count(User, { email: socialEmail })
            
            if (count < 1) {
                
                let user = new User()
                user.email = socialEmail
                user.nickname = kakaoNickname

                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values(user)
                    .execute()
                
            }
        } else if (facebookId && facebookToken) { 
            let name

            const FacebookManager = getManager();


            await axios.get(`https://graph.facebook.com/${facebookId}?fields=id,name,email&access_token=${facebookToken}`)
                .then(res => {
                    socialEmail = res.data.email
                    name = res.data.name
            }).catch(function (error) {
                console.log(error);
            });
            
            const count = await FacebookManager.count(User, { email: socialEmail })

            if (count < 1) {
                
                let user = new User()
                user.email = socialEmail
                user.nickname = name

                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values(user)
                    .execute()
            
            }
        }else if (!(email && password)) {
            res.status(400).json('아이디와 비밀번호를 입력해 주세요');
        }

        if (!email) {
            email = socialEmail
        }
        let user: User;
        try {
            // Get user from database
            user = await User.findOneOrFail({ where: { email } });
        } catch (error) {
            res.status(401).json('존재하지 않는 유저 입니다');
        }

        //Check if encrypted password match
        if(password){
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).json('비밀번호를 확인해 주세요');
            return;
        }
    }
        const userInfo = await getRepository(User)
            .createQueryBuilder("user")
                .leftJoinAndSelect("user.wishlist", "wishlist")
                .andWhere('user.email = :email', { email: email})
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
            wishlist: userInfo
        }
        //Send the jwt in the response
        res.cookie('authorization', token, { sameSite: "none", secure: true, httpOnly:true });
        res.cookie('userId', user.id, { sameSite: "none", secure: true});


        res.status(200).json(info)
    };

    static islogined = async (req: Request, res: Response) => {
        res.status(200).end('is logined')
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