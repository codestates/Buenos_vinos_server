"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CommentController_1 = require("../controllers/CommentController");
var checkJwt_1 = require("../middlewares/checkJwt");
var router = express_1.Router();
//코멘트 작성
router.post('/', [checkJwt_1.checkJwt], CommentController_1.default.createComment);
//코멘트 수정
// router.post('/', [checkJwt],)
//코멘트 삭제
// router.post('/', [checkJwt],)
exports.default = router;
