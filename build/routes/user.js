"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var checkJwt_1 = require("../middlewares/checkJwt");
var router = express_1.Router();
// Get one user
router.get('/', [checkJwt_1.checkJwt], UserController_1.default.getOneById);
//Create a new user
router.post('/', UserController_1.default.newUser);
//Edit one user
router.patch('/', [checkJwt_1.checkJwt], UserController_1.default.editUser);
//Delete one user
router.delete('/', [checkJwt_1.checkJwt], UserController_1.default.deleteUser);
//logout userauthorization
router.get('/logout', UserController_1.default.logoutUser);
exports.default = router;
