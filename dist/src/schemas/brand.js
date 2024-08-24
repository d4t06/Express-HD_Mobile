"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const brandSchema = joi_1.default.object({
    id: joi_1.default.number(),
    name: joi_1.default.string().required(),
    name_ascii: joi_1.default.string().required(),
    category_id: joi_1.default.number().required(),
    image_url: joi_1.default.string().empty(""),
});
exports.default = brandSchema;
