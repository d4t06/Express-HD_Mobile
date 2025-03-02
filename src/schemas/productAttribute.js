"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const brandSchema = joi_1.default.object({
    id: joi_1.default.number(),
    product_id: joi_1.default.number().required(),
    category_attribute_id: joi_1.default.number().required(),
    value: joi_1.default.string().required(),
});
exports.default = brandSchema;
