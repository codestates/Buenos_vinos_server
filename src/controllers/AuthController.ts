require('dotenv').config();
import { Request, Response } from 'express';
import { getRepository, getConnection, getManager } from 'typeorm';
import {OAuth2Client} from 'google-auth-library'
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';

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

        //Sing JWT, valid for 1 hour
        const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
            expiresIn: '1h',
        });
        let info = {
            userId: user.id,
            nickname: user.nickname,
            authorization: token
        }
        //Send the jwt in the response
        res.status(200).json(info)
        // 배포할때는 아래걸로!
        // res.cookie('authorization', token, {maxAge: 3600000, sameSite: "none", secure: true})
        // console.log(user.id)
        // res.cookie('userId', user.id, {maxAge: 3600000, sameSite: "none", secure: true})
        // res.json(tokenId)
    };
    static googlelogin = async (req: Request, res: Response) => { 
        let { token } = req.body;
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            console.log('구글 페이로드가 뭐냐?', payload)
            console.log('구글 유저아이디는 뭔데?', userid)
            let email = payload.email
            let name = payload.name
            let hash = payload.at_hash
            let user: User;
            
            // Get user from database
            let guser = {
                email: payload.email,
                name: payload.name,
                hash: payload.at_hash
            }
            if(!await User.findOne({ where: { email } })){
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(guser)
                .onConflict(`("email") DO NOTHING`)
                .execute()

                await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values(guser)
                .onConflict(`("hash") DO UPDATE SET "google" = :google`)
                .setParameter("google", guser.hash)
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
            let info = {
                userId: user.id,
                nickname: user.nickname,
                authorization: jwttoken
            }
            //Send the jwt in the response
            res.status(200).json(info)
            

        }
        
        
          verify().catch(console.error);
    }

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

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

        res.status(201).json('user created');
    };
}

export default AuthController;