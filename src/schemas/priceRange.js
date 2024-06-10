"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const priceRangeSchema = joi_1.default.object({
    id: joi_1.default.number(),
    category_id: joi_1.default.number().required(),
    label: joi_1.default.string().required(),
    from: joi_1.default.number().required(),
    to: joi_1.default.number().required(),
});
exports.default = priceRangeSchema;
