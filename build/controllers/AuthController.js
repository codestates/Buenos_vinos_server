"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var typeorm_1 = require("typeorm");
var google_auth_library_1 = require("google-auth-library");
var jwt = require("jsonwebtoken");
var class_validator_1 = require("class-validator");
var User_1 = require("../entity/User");
var jwtSecret = process.env.JWT_SECRET;
var client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    //
    AuthController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, user, error_1, userInfo, token, info;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password;
                    if (!(email && password)) {
                        res.status(400).json('bad request');
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, User_1.User.findOneOrFail({ where: { email: email } })];
                case 2:
                    // Get user from database
                    user = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    res.status(401).json('unauthorized');
                    return [3 /*break*/, 4];
                case 4:
                    //Check if encrypted password match
                    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                        res.status(401).json('unauthorized');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                            .createQueryBuilder("user")
                            .leftJoinAndSelect("user.wishlist", "wishlist")
                            .andWhere('user.email = :email', { email: email })
                            .select("user.id")
                            .addSelect('wishlist.id')
                            .getOne()
                        //Sing JWT, valid for 1 hour
                    ];
                case 5:
                    userInfo = _b.sent();
                    token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
                        expiresIn: '1h',
                    });
                    info = {
                        userId: user.id,
                        nickname: user.nickname,
                        authorization: token,
                        wishlist: userInfo.wishlist
                    };
                    //Send the jwt in the response
                    res.cookie('authorization', token);
                    console.log(user.id);
                    res.cookie('userId', user.id);
                    // res.cookie('authorization', token, { maxAge: 3600000, sameSite: "none", secure: true });
                    // console.log(user.id);
                    // res.cookie('userId', user.id, { maxAge: 3600000, sameSite: "none", secure: true });
                    res.status(200).json(info);
                    return [2 /*return*/];
            }
        });
    }); };
    AuthController.googlelogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        function verify() {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, payload, userid, email, name, user, count, user_1, error_2, jwttoken, userInfo, info;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.verifyIdToken({
                                idToken: tokenId,
                                audience: process.env.GOOGLE_CLIENT_ID
                            })];
                        case 1:
                            ticket = _a.sent();
                            payload = ticket.getPayload();
                            userid = payload['sub'];
                            email = payload.email;
                            name = payload.name;
                            return [4 /*yield*/, GoogleManager.count(User_1.User, { email: email })];
                        case 2:
                            count = _a.sent();
                            if (!(count < 1)) return [3 /*break*/, 4];
                            user_1 = new User_1.User();
                            user_1.email = payload.email;
                            user_1.nickname = payload.name;
                            return [4 /*yield*/, typeorm_1.getConnection()
                                    .createQueryBuilder()
                                    .insert()
                                    .into(User_1.User)
                                    .values(user_1)
                                    .execute()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, User_1.User.findOneOrFail({ where: { email: email } })];
                        case 5:
                            user = _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_2 = _a.sent();
                            res.status(401).json('아직 안만들어진거같은데?');
                            return [3 /*break*/, 7];
                        case 7:
                            jwttoken = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
                                expiresIn: '1h',
                            });
                            return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                                    .createQueryBuilder("user")
                                    .leftJoinAndSelect("user.wishlist", "wishlist")
                                    .andWhere('user.id = :id', { id: user.id })
                                    .select("user.id")
                                    .addSelect('wishlist.id')
                                    .getOne()];
                        case 8:
                            userInfo = _a.sent();
                            info = {
                                userId: user.id,
                                nickname: user.nickname,
                                authorization: jwttoken,
                                wishlist: userInfo
                            };
                            //Send the jwt in the response
                            res.cookie('authorization', jwttoken, { maxAge: 3600000, sameSite: "none", secure: true, httpOnly: true });
                            console.log(user.id);
                            res.cookie('userId', user.id, { maxAge: 3600000, sameSite: "none", secure: true, httpOnly: true });
                            res.status(200).json(info);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var tokenId, GoogleManager;
        return __generator(this, function (_a) {
            tokenId = req.body.tokenId;
            GoogleManager = typeorm_1.getManager();
            verify().catch(console.error);
            return [2 /*return*/];
        });
    }); };
    AuthController.changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, oldPassword, newPassword, user, id_1, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.cookies.userId;
                    _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                    if (!(oldPassword && newPassword)) {
                        res.status(400).json('bad request');
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, User_1.User.findOneOrFail(id)];
                case 2:
                    // Get user from the database
                    user = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    id_1 = _b.sent();
                    res.status(401).json('unauthorized');
                    return [3 /*break*/, 4];
                case 4:
                    //Check if old password matchs
                    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                        res.status(401).json('unauthorized');
                        return [2 /*return*/];
                    }
                    //Validate de model (password lenght)
                    user.password = newPassword;
                    return [4 /*yield*/, class_validator_1.validate(user)];
                case 5:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).json(errors);
                        return [2 /*return*/];
                    }
                    //Hash the new password and save
                    user.hashPassword();
                    User_1.User.save(user);
                    res.status(201).json('비밀번호가 변경되었습니다');
                    return [2 /*return*/];
            }
        });
    }); };
    return AuthController;
}());
exports.default = AuthController;
