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
var Wine_1 = require("../entity/Wine");
var User_1 = require("../entity/User");
var WineController = /** @class */ (function () {
    function WineController() {
    }
    WineController.addWishlist = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var wineId, userId, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wineId = req.params.id;
                    userId = req.cookies.userId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()
                            .relation(User_1.User, "wishlist")
                            .of(userId)
                            .add(wineId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    res.status(409).json('이미 위시리스트에 추가된 와인입니다');
                    return [2 /*return*/];
                case 4:
                    res.status(201).json("위시리스트가 추가되었습니다.");
                    return [2 /*return*/];
            }
        });
    }); };
    WineController.deleteWishlist = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var wineId, userId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wineId = req.params.id;
                    userId = req.cookies.userId;
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()
                            .relation(User_1.User, "wishlist")
                            .of(userId)
                            .remove(wineId)];
                case 1:
                    _a.sent();
                    res.status(201).json("위시리스트가 삭제되었습니다.");
                    return [2 /*return*/];
            }
        });
    }); };
    WineController.filteringWine = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var max_sweet, min_sweet, min_acidic, max_acidic, min_body, max_body, type, country, rating, food, inpact, regExp4, wine_kr, wine_en, filteredWine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    max_sweet = req.query.sweet_max;
                    min_sweet = req.query.sweet_min;
                    min_acidic = req.query.acidic_min;
                    max_acidic = req.query.acidic_max;
                    min_body = req.query.body_min;
                    max_body = req.query.body_max;
                    type = req.query.type;
                    country = req.query.country;
                    rating = req.query.rating;
                    food = req.query.food;
                    inpact = req.query.name;
                    regExp4 = /^[가-힣]+$/;
                    wine_kr = '';
                    wine_en = '';
                    regExp4.test(inpact) ? wine_kr = inpact : wine_en = inpact;
                    return [4 /*yield*/, typeorm_1.getRepository(Wine_1.Wine)
                            .createQueryBuilder("wine")
                            .leftJoinAndSelect("wine.type", "type")
                            .leftJoinAndSelect("wine.country", "country")
                            .leftJoinAndSelect("wine.food", "food")
                            .leftJoinAndSelect("wine.comment", "comment")
                            .leftJoinAndSelect("comment.user", "user")
                            .andWhere(wine_kr ? 'wine.name LIKE :name' : '1=1', { name: "%" + wine_kr + "%" })
                            .andWhere(wine_en ? 'wine.name_en LIKE :name_en' : '1=1', { name_en: "%" + wine_en + "%" })
                            .andWhere(min_sweet ? 'wine.sweet >= :min_sweet' : '1=1', { min_sweet: min_sweet })
                            .andWhere(max_sweet ? 'wine.sweet <= :max_sweet' : '1=1', { max_sweet: max_sweet })
                            .andWhere(min_acidic ? 'wine.acidic >= :min_acidic' : '1=1', { min_acidic: min_acidic })
                            .andWhere(max_acidic ? 'wine.acidic <= :max_acidic' : '1=1', { max_acidic: max_acidic })
                            .andWhere(min_body ? 'wine.body >= :min_body' : '1=1', { min_body: min_body })
                            .andWhere(max_body ? 'wine.body <= :max_body' : '1=1', { max_body: max_body })
                            .andWhere(type ? 'type.name IN (:...t)' : '1=1', { t: type })
                            .andWhere(country ? 'country.name IN (:...c)' : '1=1', { c: country })
                            .andWhere(rating ? 'wine.rating >= :rating' : '1=1', { rating: rating })
                            .andWhere(food ? 'food.name IN (:...f)' : '1=1', { f: food })
                            .select("wine")
                            .addSelect("type")
                            .addSelect("country")
                            .addSelect("food")
                            .addSelect("comment")
                            .addSelect("user.id")
                            .addSelect("user.nickname")
                            .getMany()];
                case 1:
                    filteredWine = _a.sent();
                    res.json(filteredWine);
                    return [2 /*return*/];
            }
        });
    }); };
    return WineController;
}());
exports.default = WineController;
