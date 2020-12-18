"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var bcrypt = require("bcryptjs");
var Wine_1 = require("./Wine");
var Comment_1 = require("./Comment");
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User.prototype.hashPassword = function () {
        this.password = bcrypt.hashSync(this.password, 8);
    };
    User.prototype.checkIfUnencryptedPasswordIsValid = function (unencryptedPassword) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        class_validator_1.Length(4, 20),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], User.prototype, "nickname", void 0);
    __decorate([
        typeorm_1.Column(),
        class_validator_1.Length(4, 100),
        typeorm_1.Column({
            nullable: true
        }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column({
            nullable: true
        }),
        __metadata("design:type", String)
    ], User.prototype, "google", void 0);
    __decorate([
        typeorm_1.Column({
            nullable: true
        }),
        __metadata("design:type", String)
    ], User.prototype, "facebook", void 0);
    __decorate([
        typeorm_1.Column({
            nullable: true
        }),
        __metadata("design:type", String)
    ], User.prototype, "kakao", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({
            name: "created_at"
        }),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.OneToMany(function (comment) { return Comment_1.Comment; }, function (comment) { return comment.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "comment", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return Wine_1.Wine; }, function (wine) { return wine.wishlist; }),
        typeorm_1.JoinTable({
            name: "wishlist"
        }),
        __metadata("design:type", Array)
    ], User.prototype, "wishlist", void 0);
    User = __decorate([
        typeorm_1.Entity({
            name: 'user',
        }),
        typeorm_1.Unique(['email'])
    ], User);
    return User;
}(typeorm_1.BaseEntity));
exports.User = User;
