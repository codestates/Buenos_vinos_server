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
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var routes_1 = require("./routes");
var port = process.env.PORT || 3000;
var app = express();
//Connects to the Database -> then starts the express
typeorm_1.createConnection()
    .then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //
        // Implement middlewares
        app.use(cors({
            origin: [
                'http://localhost:3000',
                'http://54.180.150.63:3000',
                'http://localhost:3001',
                'http://buenosvinos-client.s3-website.ap-northeast-2.amazonaws.com',
                'https://buenos-vinos.ml',
                'https://api.rss2json.com',
                'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Frss.blog.naver.com%2Fwine21com.xml'
            ],
            methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
            credentials: true,
        }));
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(cookieParser());
        // Sets all routes
        app.use('/', routes_1.default);
        // Start server
        app.listen(port, function () {
            console.log("Server started on port http://localhost:" + port);
        });
        return [2 /*return*/];
    });
}); })
    .catch(function (error) { return console.log(error); });
