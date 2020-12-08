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
var Comment_1 = require("../entity/Comment");
var Wine_1 = require("../entity/Wine");
var CommentController = /** @class */ (function () {
    function CommentController() {
    }
    CommentController.createComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, WineManager, _a, content, rating, wineId, comment, errors, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = req.cookies.userId;
                    WineManager = typeorm_1.getManager();
                    _a = req.body, content = _a.content, rating = _a.rating, wineId = _a.wineId;
                    //와인 레이팅값 업데이트
                    return [4 /*yield*/, WineManager.increment(Wine_1.Wine, { id: wineId }, "rating_sum", rating)];
                case 1:
                    //와인 레이팅값 업데이트
                    _b.sent();
                    return [4 /*yield*/, WineManager.increment(Wine_1.Wine, { id: wineId }, "rating_count", 1)];
                case 2:
                    _b.sent();
                    comment = new Comment_1.Comment();
                    comment.content = content;
                    comment.rating = rating;
                    comment.user = userId;
                    comment.wine = wineId;
                    return [4 /*yield*/, class_validator_1.validate(comment)];
                case 3:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).json(errors);
                        return [2 /*return*/];
                    }
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, Comment_1.Comment.save(comment)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    res.status(409).json('문제가 있습니다?');
                    return [2 /*return*/];
                case 7:
                    res.status(201).json('코멘트가 작성되었습니다.');
                    return [2 /*return*/];
            }
        });
    }); };
    CommentController.editComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, content, rating, commentId, comment, WineManager, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, content = _a.content, rating = _a.rating, commentId = _a.commentId;
                    WineManager = typeorm_1.getManager();
                    return [4 /*yield*/, typeorm_1.getRepository(Comment_1.Comment)
                            .createQueryBuilder("comment")
                            .leftJoinAndSelect("comment.wine", "wine")
                            .andWhere('comment.id = :id', { id: commentId })
                            .getOne()];
                case 1:
                    comment = _b.sent();
                    return [4 /*yield*/, WineManager.decrement(Wine_1.Wine, { id: comment.wine.id }, "rating_sum", comment.rating)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, WineManager.decrement(Wine_1.Wine, { id: comment.wine.id }, "rating_count", 1)];
                case 3:
                    _b.sent();
                    comment.content = content;
                    comment.rating = rating;
                    return [4 /*yield*/, WineManager.increment(Wine_1.Wine, { id: comment.wine.id }, "rating_sum", rating)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, WineManager.increment(Wine_1.Wine, { id: comment.wine.id }, "rating_count", 1)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, class_validator_1.validate(comment)];
                case 6:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).json(errors);
                        return [2 /*return*/];
                    }
                    res.status(200).json('코멘트가 변경되었습니다');
                    return [2 /*return*/];
            }
        });
    }); };
    CommentController.deleteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var commentId, comment, WineManager;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentId = req.body.commentId;
                    WineManager = typeorm_1.getManager();
                    return [4 /*yield*/, typeorm_1.getRepository(Comment_1.Comment)
                            .createQueryBuilder("comment")
                            .leftJoinAndSelect("comment.wine", "wine")
                            .andWhere('comment.id = :id', { id: commentId })
                            .getOne()];
                case 1:
                    comment = _a.sent();
                    return [4 /*yield*/, WineManager.decrement(Wine_1.Wine, { id: comment.wine.id }, "rating_sum", comment.rating)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, WineManager.decrement(Wine_1.Wine, { id: comment.wine.id }, "rating_count", 1)];
                case 3:
                    _a.sent();
                    Comment_1.Comment.delete(commentId);
                    res.status(200).json('코멘트가 삭제되었습니다');
                    return [2 /*return*/];
            }
        });
    }); };
    return CommentController;
}());
exports.default = CommentController;
