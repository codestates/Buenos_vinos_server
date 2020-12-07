"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
require('dotenv').config();
var jwt = require("jsonwebtoken");
var jwtSecret = process.env.JWT_SECRET;
var checkJwt = function (req, res, next) {
    //Get the jwt token from the head
    var token = req.headers['authorization'];
    var jwtPayload;
    var jwtCookieToken = req.cookies.authorization;
    //Try to validate the token and get data
    try {
        jwtPayload = jwt.verify(jwtCookieToken.replace('Bearer ', ''), jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).json('권한이 없으신데요?');
        return;
    }
    //The token is valid for 1 hour
    //We want to send a new token on every request
    var userId = jwtPayload.userId, username = jwtPayload.username;
    var newToken = jwt.sign({ userId: userId, username: username }, jwtSecret, {
        expiresIn: '1h',
    });
    res.setHeader('token', newToken);
    //Call the next middleware or controller
    next();
};
exports.checkJwt = checkJwt;
