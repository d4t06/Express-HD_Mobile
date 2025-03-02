"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const descriptionSchema = joi_1.default.object({
    id: joi_1.default.number(),
    product_id: joi_1.default.number().required(),
    content: joi_1.default.string().required(),
});
exports.default = descriptionSchema;
