"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const variantSchema = joi_1.default.object({
    id: joi_1.default.number(),
    product_ascii: joi_1.default.string().required(),
    variant: joi_1.default.string().required(),
    variant_ascii: joi_1.default.string().required(),
});
exports.default = variantSchema;
