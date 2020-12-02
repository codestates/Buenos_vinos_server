"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var WineController_1 = require("../controllers/WineController");
var router = express_1.Router();
router.get('/', WineController_1.default.listAll);
exports.default = router;
