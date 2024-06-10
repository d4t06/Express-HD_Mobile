"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const sliderImage = joi_1.default.object({
    id: joi_1.default.number(),
    slider_id: joi_1.default.number().required(),
    image_id: joi_1.default.number().required(),
    link_to: joi_1.default.string().empty(""),
});
exports.default = sliderImage;
