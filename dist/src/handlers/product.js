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
const myResponse_1 = __importDefault(require("../system/myResponse"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const product_1 = __importDefault(require("../schemas/product"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const description_1 = __importDefault(require("../models/description"));
const defaultProductVariant_1 = __importDefault(require("../models/defaultProductVariant"));
const variant_1 = __importDefault(require("../models/variant"));
const defaultVariantCombine_1 = __importDefault(require("../models/defaultVariantCombine"));
const productSlider_1 = __importDefault(require("../models/productSlider"));
const combine_1 = __importDefault(require("../models/combine"));
// import {
//    Description,
//    DefaultProductVariant,
//    Variant,
//    DefaultVariantCombine,
//    Category,
//    CategoryAttribute,
//    Color,
//    ProductSlider,
//    Slider,
//    Image,
//    SliderImage,
//    Combine,
// } from "../models";
const product_2 = __importDefault(require("../services/product"));
const sequelize_1 = require("sequelize");
const helper_1 = require("../system/helper");
const product_3 = __importDefault(require("../models/product"));
const PAGE_SIZE = 6;
class ProductHandler {
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const { page, brand_id, category_id, price, size } = query;
                const sort = res.locals.sort;
                const _size = (size && typeof size === "string" && +size < 12 && +size) || PAGE_SIZE;
                const _page = (page && typeof page === "string" && +page) || 1;
                const where = {};
                const combineWhere = {};
                const order = [
                    ["id", "DESC"],
                ];
                if (category_id)
                    where.category_id = category_id;
                if (brand_id)
                    where.brand_id = {
                        [sequelize_1.Op.in]: brand_id,
                    };
                if (price) {
                    const [gThan, lThan] = price;
                    if (!Number.isNaN(+gThan) && !Number.isNaN(+lThan)) {
                        combineWhere.price = {
                            [sequelize_1.Op.and]: {
                                [sequelize_1.Op.gt]: +gThan * 1000000,
                                [sequelize_1.Op.lt]: +lThan * 1000000,
                            },
                        };
                    }
                }
                if (sort.enable) {
                    // if (sort.column === "price") {
                    // order.push([
                    //    { model: DefaultProductVariant, as: "default_variant" },
                    //    {
                    //       model: Variant,
                    //       as: "variant",
                    //    },
                    //    {
                    //       model: DefaultVariantCombine,
                    //       as: "default_combine",
                    //    },
                    //    {
                    //       model: Combine,
                    //       as: "combine",
                    //    },
                    //    sort.column,
                    //    sort.type,
                    // ]);
                    // }
                    if (sort.column === "price") {
                        order.push([
                            "default_variant",
                            "variant",
                            "default_combine",
                            "combine",
                            sort.column,
                            sort.type,
                        ]);
                    }
                }
                const { count, rows } = yield product_3.default.findAndCountAll({
                    offset: (_page - 1) * _size,
                    limit: _size,
                    distinct: true,
                    include: [
                        {
                            required: true,
                            model: defaultProductVariant_1.default,
                            as: "default_variant",
                            include: [
                                {
                                    required: true,
                                    model: variant_1.default,
                                    as: "variant",
                                    include: [
                                        {
                                            required: true,
                                            model: defaultVariantCombine_1.default,
                                            as: "default_combine",
                                            include: [
                                                {
                                                    required: true,
                                                    model: combine_1.default,
                                                    as: "combine",
                                                    // order,
                                                    where: combineWhere,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            model: variant_1.default,
                            as: "variants",
                            include: [
                                {
                                    model: defaultVariantCombine_1.default,
                                    as: "default_combine",
                                    include: [
                                        {
                                            model: combine_1.default,
                                            as: "combine",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    order,
                    where,
                });
                return (0, myResponse_1.default)(res, true, "get all product successful", 200, {
                    products: rows,
                    count,
                    page: _page,
                    size: _size,
                    sort: sort.enable,
                    category_id: +category_id || null,
                    brand_id: (brand_id === null || brand_id === void 0 ? void 0 : brand_id.length) ? brand_id : null,
                    column: sort.enable ? sort.column : null,
                    type: sort.enable ? sort.type : null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                if (!productId || isNaN(+productId))
                    throw new BadRequest_1.default("");
                const product = yield product_2.default.findOne(+productId);
                if (product === null)
                    return (0, myResponse_1.default)(res, false, "Product not found", 404);
                return (0, myResponse_1.default)(res, true, "Get product successful", 200, product);
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
                const value = product_1.default.validate(body);
                // check
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const founded = yield product_3.default.findOne({
                    where: {
                        name_ascii: (0, helper_1.generateId)(body.name),
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Product name already exist", 409);
                const newProduct = yield product_3.default.create(Object.assign(Object.assign({}, body), { name_ascii: (0, helper_1.generateId)(body.name) }));
                yield new description_1.default({
                    content: newProduct.name,
                    product_id: newProduct.id,
                }).save();
                yield new defaultProductVariant_1.default({
                    product_id: newProduct.id,
                }).save();
                return (0, myResponse_1.default)(res, true, "add product successful", 200, newProduct);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const body = req.body;
                // const value = productSchema.validate(body);
                const foundedProduct = yield product_3.default.findByPk(productId);
                if (!foundedProduct)
                    throw new ObjectNotFound_1.default("");
                if (foundedProduct.name_ascii !== (0, helper_1.generateId)(body.name)) {
                    const exist = yield product_3.default.findByPk(productId);
                    if (exist)
                        return (0, myResponse_1.default)(res, false, "Product name already exist", 409);
                }
                yield foundedProduct.update(body);
                // await Product.update(body, { where: { id: +productId } });
                return (0, myResponse_1.default)(res, true, "update product successful", 200);
            }
            catch (error) {
                next(error);
            }
        });
    }
    search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q, page, size } = req.query;
            const _size = (size && typeof size === "string" && +size < 12 && +size) || PAGE_SIZE;
            const _page = (page && typeof page === "string" && +page) || 1;
            const sort = res.locals.sort;
            const order = [];
            if (sort.enable) {
                if (sort.column === "price") {
                    order.push([
                        { model: defaultProductVariant_1.default, as: "default_variant" },
                        {
                            model: variant_1.default,
                            as: "variant",
                        },
                        {
                            model: defaultVariantCombine_1.default,
                            as: "default_combine",
                        },
                        {
                            model: combine_1.default,
                            as: "combine",
                        },
                        sort.column,
                        sort.type,
                    ]);
                }
            }
            const { count, rows } = yield product_3.default.findAndCountAll({
                offset: (_page - 1) * _size,
                limit: _size,
                distinct: true,
                include: [
                    {
                        model: defaultProductVariant_1.default,
                        as: "default_variant",
                        include: [
                            {
                                model: variant_1.default,
                                as: "variant",
                                include: [
                                    {
                                        model: defaultVariantCombine_1.default,
                                        as: "default_combine",
                                        include: [
                                            {
                                                model: combine_1.default,
                                                as: "combine",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: variant_1.default,
                        as: "variants",
                        include: [
                            {
                                model: defaultVariantCombine_1.default,
                                as: "default_combine",
                                include: [
                                    {
                                        model: combine_1.default,
                                        as: "combine",
                                    },
                                ],
                            },
                        ],
                    },
                ],
                where: {
                    name_ascii: { [sequelize_1.Op.like]: `%${(0, helper_1.generateId)(q)}%` },
                },
            });
            return (0, myResponse_1.default)(res, true, "search product successful", 200, {
                products: rows,
                count,
                page_size: _size,
                page: _page,
                sort: sort.enable,
                column: sort.enable ? sort.column : null,
                type: sort.enable ? sort.type : null,
            });
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const item = yield product_3.default.findByPk(productId, {
                    include: [
                        {
                            model: productSlider_1.default,
                            as: "product_sliders",
                            include: [productSlider_1.default.associations.slider],
                        },
                    ],
                });
                if (!item)
                    throw new ObjectNotFound_1.default("");
                for (const productSlider of item.product_sliders) {
                    yield productSlider.slider.destroy();
                }
                yield item.destroy();
                return (0, myResponse_1.default)(res, true, "delete price range successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new ProductHandler();
