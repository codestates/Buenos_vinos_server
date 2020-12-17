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
exports.Wine = void 0;
var typeorm_1 = require("typeorm");
var Type_1 = require("./Type");
var country_1 = require("./country");
var food_1 = require("./food");
var User_1 = require("./User");
var Comment_1 = require("./Comment");
var Wine = /** @class */ (function (_super) {
    __extends(Wine, _super);
    function Wine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Wine.prototype.calculrateRating = function () {
        this.rating = this.rating_sum / this.rating_count;
    };
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Wine.prototype, "id", void 0);
    __decorate([
        typeorm_1.Index({ fulltext: true }),
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Wine.prototype, "name", void 0);
    __decorate([
        typeorm_1.Index({ fulltext: true }),
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Wine.prototype, "name_en", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Wine.prototype, "image", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Wine.prototype, "body", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Wine.prototype, "sweet", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Wine.prototype, "acidic", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Wine.prototype, "alcohol_content", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Wine.prototype, "winery", void 0);
    __decorate([
        typeorm_1.Column({
            type: "longtext"
        }),
        __metadata("design:type", String)
    ], Wine.prototype, "content", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Wine.prototype, "rating_sum", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Wine.prototype, "rating_count", void 0);
    __decorate([
        typeorm_1.CreateDateColumn({
            name: "created_at"
        }),
        __metadata("design:type", Date)
    ], Wine.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.Column({
            type: 'decimal',
            precision: 5,
            scale: 1,
            default: 0
        }),
        __metadata("design:type", Number)
    ], Wine.prototype, "rating", void 0);
    __decorate([
        typeorm_1.BeforeInsert(),
        typeorm_1.BeforeUpdate(),
        typeorm_1.AfterInsert(),
        typeorm_1.AfterLoad(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Wine.prototype, "calculrateRating", null);
    __decorate([
        typeorm_1.ManyToOne(function (wine) { return Type_1.Type; }, function (type) { return type.wine; }, { onDelete: 'CASCADE' }),
        __metadata("design:type", Type_1.Type)
    ], Wine.prototype, "type", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (wine) { return country_1.Country; }, function (country) { return country.wine; }, { onDelete: 'CASCADE' }),
        __metadata("design:type", country_1.Country)
    ], Wine.prototype, "country", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return food_1.Food; }),
        typeorm_1.JoinTable({
            name: 'wine_food'
        }),
        __metadata("design:type", Array)
    ], Wine.prototype, "food", void 0);
    __decorate([
        typeorm_1.ManyToMany(function () { return User_1.User; }, function (user) { return user.wishlist; }, { cascade: ["insert", "update", "remove"] }),
        __metadata("design:type", Array)
    ], Wine.prototype, "wishlist", void 0);
    __decorate([
        typeorm_1.OneToMany(function (comment) { return Comment_1.Comment; }, function (comment) { return comment.wine; }),
        __metadata("design:type", Array)
    ], Wine.prototype, "comment", void 0);
    Wine = __decorate([
        typeorm_1.Entity({
            name: 'wine',
        })
    ], Wine);
    return Wine;
}(typeorm_1.BaseEntity));
exports.Wine = Wine;
