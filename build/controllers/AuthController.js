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
var axios_1 = require("axios");
var User_1 = require("../entity/User");
var jwtSecret = process.env.JWT_SECRET;
var client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    //
    AuthController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, google, kakao, facebookId, facebookToken, socialEmail, GoogleManager, ticket, payload, userid, name_1, user_1, count, user_2, KakaoManager, data, kakaoNickname_1, user_3, config, count, user_4, name_2, FacebookManager, count, user_5, user, error_1, userInfo, token, info;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password, google = _a.google, kakao = _a.kakao, facebookId = _a.facebookId, facebookToken = _a.facebookToken;
                    if (!google) return [3 /*break*/, 5];
                    GoogleManager = typeorm_1.getManager();
                    return [4 /*yield*/, client.verifyIdToken({
                            idToken: google,
                            audience: process.env.GOOGLE_CLIENT_ID
                        })];
                case 1:
                    ticket = _b.sent();
                    payload = ticket.getPayload();
                    userid = payload['sub'];
                    socialEmail = payload.email;
                    name_1 = payload.name;
                    return [4 /*yield*/, GoogleManager.count(User_1.User, { email: socialEmail })];
                case 2:
                    count = _b.sent();
                    if (!(count < 1)) return [3 /*break*/, 4];
                    user_2 = new User_1.User();
                    user_2.email = payload.email;
                    user_2.nickname = payload.name;
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()
                            .insert()
                            .into(User_1.User)
                            .values(user_2)
                            .execute()];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [3 /*break*/, 16];
                case 5:
                    if (!kakao) return [3 /*break*/, 10];
                    KakaoManager = typeorm_1.getManager();
                    data = '';
                    config = {
                        method: 'get',
                        url: 'https://kapi.kakao.com/v2/user/me',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer {" + kakao + "}"
                        },
                        data: data
                    };
                    return [4 /*yield*/, axios_1.default(config)
                            .then(function (res) {
                            socialEmail = res.data.kakao_account.email;
                            kakaoNickname_1 = res.data.kakao_account.profile.nickname;
                        })
                            .catch(function (error) {
                            console.log(error);
                        })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, KakaoManager.count(User_1.User, { email: socialEmail })];
                case 7:
                    count = _b.sent();
                    if (!(count < 1)) return [3 /*break*/, 9];
                    user_4 = new User_1.User();
                    user_4.email = socialEmail;
                    user_4.nickname = kakaoNickname_1;
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()
                            .insert()
                            .into(User_1.User)
                            .values(user_4)
                            .execute()];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 16];
                case 10:
                    if (!(facebookId && facebookToken)) return [3 /*break*/, 15];
                    FacebookManager = typeorm_1.getManager();
                    return [4 /*yield*/, axios_1.default.get("https://graph.facebook.com/" + facebookId + "?fields=id,name,email&access_token=" + facebookToken)
                            .then(function (res) {
                            socialEmail = res.data.email;
                            name_2 = res.data.name;
                        }).catch(function (error) {
                            console.log(error);
                        })];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, FacebookManager.count(User_1.User, { email: socialEmail })];
                case 12:
                    count = _b.sent();
                    if (!(count < 1)) return [3 /*break*/, 14];
                    user_5 = new User_1.User();
                    user_5.email = socialEmail;
                    user_5.nickname = name_2;
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()
                            .insert()
                            .into(User_1.User)
                            .values(user_5)
                            .execute()];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    if (!(email && password)) {
                        res.status(400).json('아이디와 비밀번호를 입력해 주세요');
                    }
                    _b.label = 16;
                case 16:
                    if (!email) {
                        email = socialEmail;
                    }
                    _b.label = 17;
                case 17:
                    _b.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, User_1.User.findOneOrFail({ where: { email: email } })];
                case 18:
                    // Get user from database
                    user = _b.sent();
                    return [3 /*break*/, 20];
                case 19:
                    error_1 = _b.sent();
                    res.status(401).json('존재하지 않는 유저 입니다');
                    return [3 /*break*/, 20];
                case 20:
                    //Check if encrypted password match
                    if (password) {
                        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                            res.status(401).json('비밀번호를 확인해 주세요');
                            return [2 /*return*/];
                        }
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
                case 21:
                    userInfo = _b.sent();
                    token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
                        expiresIn: '1h',
                    });
                    info = {
                        userId: user.id,
                        nickname: user.nickname,
                        wishlist: userInfo
                    };
                    //Send the jwt in the response
                    res.cookie('authorization', token, { sameSite: "none", secure: true, httpOnly: true });
                    res.cookie('userId', user.id, { sameSite: "none", secure: true });
                    res.status(200).json(info);
                    return [2 /*return*/];
            }
        });
    }); };
    AuthController.islogined = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.status(200).end('is logined');
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
