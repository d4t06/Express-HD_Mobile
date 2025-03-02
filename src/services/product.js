"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const product_1 = __importDefault(require("../models/product"));
class ProductService {
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_1.default.findByPk(id, {
                include: [
                    {
                        model: models_1.Category,
                        as: "category",
                        include: [
                            {
                                model: models_1.CategoryAttribute,
                                as: "attributes",
                            },
                        ],
                    },
                    {
                        model: models_1.Variant,
                        as: "variants",
                        include: [
                            {
                                model: models_1.DefaultVariantCombine,
                                as: "default_combine",
                            },
                        ],
                    },
                    product_1.default.associations.default_variant,
                    product_1.default.associations.combines,
                    {
                        model: models_1.Color,
                        as: "colors",
                        include: [
                            {
                                model: models_1.ProductSlider,
                                as: "product_slider",
                                include: [
                                    {
                                        model: models_1.Slider,
                                        as: "slider",
                                        include: [
                                            {
                                                model: models_1.SliderImage,
                                                as: "slider_images",
                                                include: [
                                                    {
                                                        model: models_1.Image,
                                                        as: "image",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    product_1.default.associations.attributes,
                    product_1.default.associations.description,
                ],
            });
            return product;
        });
    }
}
exports.default = new ProductService();
