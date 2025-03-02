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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const helper_1 = require("../system/helper");
class CategoryService {
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Category.findByPk(id, {
                include: [
                    models_1.Category.associations.brands,
                    models_1.Category.associations.attributes,
                    models_1.Category.associations.price_ranges,
                    {
                        model: models_1.CategorySlider,
                        as: "category_slider",
                        include: [
                            {
                                model: models_1.Slider,
                                as: "slider",
                                include: [
                                    {
                                        model: models_1.SliderImage,
                                        as: "slider_images",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    }
    add(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield models_1.Category.create(body);
            // create slider
            const slider = yield models_1.Slider.create({
                name: `slider for ${category.name}`,
            });
            yield models_1.CategorySlider.create({
                category_id: category.id,
                slider_id: slider.id,
            });
            const newCategory = yield this.findOne(category.id);
            return newCategory;
        });
    }
    import(categories) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategories = [];
            // throw new Forbiden("");
            for (const c of categories) {
                const foundedCategory = yield models_1.Category.findOne({
                    where: {
                        name_ascii: (0, helper_1.generateId)(c.name),
                    },
                });
                if (foundedCategory)
                    continue;
                /** crate category */
                const newCategory = yield new models_1.Category({
                    name: c.name,
                    name_ascii: (0, helper_1.generateId)(c.name),
                    attribute_order: "",
                    hidden: false,
                }).save();
                /** slider */
                const slider = yield models_1.Slider.create({
                    name: `slider for ${c.name}`,
                });
                yield models_1.CategorySlider.create({
                    category_id: newCategory.id,
                    slider_id: slider.id,
                });
                /** brands */
                const brandSchemas = c.brands.map((b) => ({
                    category_id: newCategory.id,
                    image_url: "",
                    name: b,
                    name_ascii: (0, helper_1.generateId)(b),
                }));
                yield models_1.Brand.bulkCreate(brandSchemas);
                /** attributes */
                const attributeSchemas = c.attributes.map((a) => ({
                    category_id: newCategory.id,
                    name: a,
                    name_ascii: (0, helper_1.generateId)(a),
                }));
                const newAttributes = yield models_1.CategoryAttribute.bulkCreate(attributeSchemas);
                const attributeOrder = newAttributes.map((a) => a.id);
                yield newCategory.set("attribute_order", attributeOrder.join("_")).save();
                const _newCategory = yield this.findOne(newCategory.id);
                if (_newCategory)
                    newCategories.push(_newCategory);
            }
            return newCategories;
        });
    }
}
exports.default = new CategoryService();
