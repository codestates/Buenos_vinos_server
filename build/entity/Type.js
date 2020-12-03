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
exports.Type = void 0;
var typeorm_1 = require("typeorm");
var Wine_1 = require("./Wine");
var Type = /** @class */ (function (_super) {
    __extends(Type, _super);
    function Type() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Type.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Type.prototype, "type", void 0);
    __decorate([
        typeorm_1.Column({
            type: "longtext"
        }),
        __metadata("design:type", String)
    ], Type.prototype, "type_content", void 0);
    __decorate([
        typeorm_1.Column({
            type: "longtext"
        }),
        __metadata("design:type", String)
    ], Type.prototype, "sweet_content", void 0);
    __decorate([
        typeorm_1.Column({
            type: "longtext"
        }),
        __metadata("design:type", String)
    ], Type.prototype, "acidic_content", void 0);
    __decorate([
        typeorm_1.Column({
            type: "longtext"
        }),
        __metadata("design:type", String)
    ], Type.prototype, "body_content", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Wine_1.Wine; }, function (wine) { return wine.types_id; }, { onDelete: 'CASCADE' }),
        __metadata("design:type", Wine_1.Wine)
    ], Type.prototype, "wine", void 0);
    Type = __decorate([
        typeorm_1.Entity({
            name: 'type',
        })
    ], Type);
    return Type;
}(typeorm_1.BaseEntity));
exports.Type = Type;
