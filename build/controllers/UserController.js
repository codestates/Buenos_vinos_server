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
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var User_1 = require("../entity/User");
var UserController = /** @class */ (function () {
    function UserController() {
    }
    //
    UserController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.User.find({
                        select: ['id', 'email'],
                    })];
                case 1:
                    users = _a.sent();
                    //Send the users object
                    res.json(users);
                    return [2 /*return*/];
            }
        });
    }); };
    UserController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, userInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.cookies.userId;
                    return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
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
                            .getOne()];
                case 1:
                    userInfo = _a.sent();
                    res.json(userInfo);
                    return [2 /*return*/];
            }
        });
    }); };
    UserController.newUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, email, password, nickname, google, facebook, kakao, user, errors, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password, nickname = _a.nickname, google = _a.google, facebook = _a.facebook, kakao = _a.kakao;
                    user = new User_1.User();
                    user.email = email;
                    user.password = password;
                    user.nickname = nickname;
                    user.google = google;
                    user.facebook = facebook;
                    user.kakao = kakao;
                    return [4 /*yield*/, class_validator_1.validate(user)];
                case 1:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).json(errors);
                        return [2 /*return*/];
                    }
                    //Hash the password, to securely store on DB
                    user.hashPassword();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    //Try to save. If fails, the username is already in use
                    return [4 /*yield*/, User_1.User.save(user)];
                case 3:
                    //Try to save. If fails, the username is already in use
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _b.sent();
                    res.status(409).json('이미 존재하는 별명입니다');
                    return [2 /*return*/];
                case 5:
                    //If all ok, send 201 response
                    res.status(201).json('User created');
                    return [2 /*return*/];
            }
        });
    }); };
    UserController.editUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, nickname, user, errors, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.cookies.userId;
                    nickname = req.body.nickname;
                    return [4 /*yield*/, User_1.User.findOneOrFail(id)];
                case 1:
                    //Try to find user on database
                    user = _a.sent();
                    //Validate the new values on model
                    user.nickname = nickname;
                    return [4 /*yield*/, class_validator_1.validate(user)];
                case 2:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        res.status(400).json(errors);
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, User_1.User.save(user)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    res.status(409).json('이미 존재하는 별명입니다');
                    return [2 /*return*/];
                case 6:
                    //After all send a 204 (no content, but accepted) response 204로 보내면 res.json이 안간다
                    // res.status(204).json('정보가 업데이트 되었습니다');
                    res.status(200).json('유저 정보가 변경되었습니다');
                    return [2 /*return*/];
            }
        });
    }); };
    UserController.deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.cookies.userId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, User_1.User.findOneOrFail(id)];
                case 2:
                    user = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).json('User not found');
                    return [2 /*return*/];
                case 4:
                    User_1.User.delete(id);
                    //After all send a 204 (no content, but accepted) response
                    res.status(200).json('유저정보가 삭제되었습니다');
                    return [2 /*return*/];
            }
        });
    }); };
    UserController.logoutUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            res.clearCookie('authorization', { sameSite: "none", secure: true, httpOnly: true });
            res.clearCookie('userId', { sameSite: "none", secure: true, httpOnly: true });
            console.log(req.cookies);
            // res.send('logout OK').redirect("/")
            res.status(200).send('성공적으로 로그아웃 되었습니다.');
            return [2 /*return*/];
        });
    }); };
    return UserController;
}());
exports.default = UserController;
