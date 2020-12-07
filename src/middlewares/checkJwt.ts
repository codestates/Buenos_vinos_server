require('dotenv').config();

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    let token: string = <string>req.headers['authorization'];
    let jwtPayload;
    let jwtCookieToken = req.cookies.authorization

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(jwtCookieToken.replace('Bearer ', ''), jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json('권한이 없으신데요?');
        return;
    }

    //The token is valid for 1 hour
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, jwtSecret, {
        expiresIn: '1h',
    });
    res.setHeader('token', newToken);

    //Call the next middleware or controller
    next();
};