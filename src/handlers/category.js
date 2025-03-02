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
const category_1 = __importDefault(require("../models/category"));
const image_1 = __importDefault(require("../models/image"));
const brand_1 = __importDefault(require("../models/brand"));
const slider_1 = __importDefault(require("../models/slider"));
const categorySlider_1 = __importDefault(require("../models/categorySlider"));
const sliderImage_1 = __importDefault(require("../models/sliderImage"));
const myResponse_1 = __importDefault(require("../system/myResponse"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const category_2 = __importDefault(require("../schemas/category"));
const helper_1 = require("../system/helper");
const category_3 = __importDefault(require("../services/category"));
const models_1 = require("../models");
class categoryHandler {
    findAll(_req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield category_1.default.findAll({
                    include: [
                        category_1.default.associations.brands,
                        category_1.default.associations.attributes,
                        category_1.default.associations.price_ranges,
                        {
                            model: categorySlider_1.default,
                            as: "category_slider",
                            include: [
                                {
                                    model: slider_1.default,
                                    as: "slider",
                                    include: [
                                        {
                                            model: sliderImage_1.default,
                                            as: "slider_images",
                                            include: [
                                                {
                                                    model: image_1.default,
                                                    as: "image",
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
                return (0, myResponse_1.default)(res, true, "get all categories", 200, categories);
            }
            catch (error) {
                next(error);
            }
        });
    }
    findAllLess(_req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield category_1.default.findAll({
                    include: [
                        {
                            model: brand_1.default,
                            as: "brands",
                            attributes: ["name_ascii", "id"],
                        },
                        {
                            model: models_1.CategoryAttribute,
                            as: "attributes",
                            attributes: ["name_ascii", "id"],
                        },
                    ],
                    attributes: ["name_ascii", "id"],
                    where: {
                        hidden: false,
                    },
                });
                return res.json(categories);
            }
            catch (error) {
                next(error);
            }
        });
    }
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = category_2.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const founded = yield category_1.default.findOne({
                    where: {
                        name_ascii: (0, helper_1.generateId)(body.name),
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Category already exist", 409);
                const category = yield category_1.default.create(Object.assign(Object.assign({}, body), { name_ascii: (0, helper_1.generateId)(body.name) }));
                // create slider
                const slider = yield slider_1.default.create({
                    name: `slider for ${category.name}`,
                });
                yield categorySlider_1.default.create({
                    category_id: category.id,
                    slider_id: slider.id,
                });
                const newCategory = yield category_1.default.findByPk(category.id, {
                    include: [
                        category_1.default.associations.brands,
                        category_1.default.associations.attributes,
                        category_1.default.associations.price_ranges,
                        {
                            model: categorySlider_1.default,
                            as: "category_slider",
                            include: [
                                {
                                    model: slider_1.default,
                                    as: "slider",
                                    include: [
                                        {
                                            model: sliderImage_1.default,
                                            as: "slider_images",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
                return (0, myResponse_1.default)(res, true, "add category successful", 200, newCategory);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { id } = req.params;
                const value = category_2.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const founded = yield brand_1.default.findOne({
                    where: {
                        name_ascii: body.name_ascii,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Category already exist", 409);
                const item = yield category_1.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                yield item.update(body);
                Object.assign(item, body);
                return (0, myResponse_1.default)(res, true, "update category successful", 200, item);
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield category_1.default.findByPk(+id, {
                    include: [
                        {
                            model: categorySlider_1.default,
                            as: "category_slider",
                            include: [categorySlider_1.default.associations.slider],
                        },
                    ],
                });
                if (!category)
                    throw new ObjectNotFound_1.default("");
                if (category.category_slider)
                    yield category.category_slider.slider.destroy();
                yield category.destroy();
                return (0, myResponse_1.default)(res, true, "delete category successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    import(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                const newCategories = yield category_3.default.import(data);
                return (0, myResponse_1.default)(res, true, "Import category successful", 200, newCategories);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new categoryHandler();
