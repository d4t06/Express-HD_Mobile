"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const ratingSchema = joi_1.default.object({
    id: joi_1.default.number(),
    product_id: joi_1.default.number().required(),
    username: joi_1.default.string().required(),
    content: joi_1.default.string().empty(""),
    rate: joi_1.default.number().required(),
});
exports.default = ratingSchema;
