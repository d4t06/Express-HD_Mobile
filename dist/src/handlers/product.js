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
const product_2 = __importDefault(require("../models/product"));
const description_1 = __importDefault(require("../models/description"));
const defaultProductVariant_1 = __importDefault(require("../models/defaultProductVariant"));
const variant_1 = __importDefault(require("../models/variant"));
const defaultVariantCombine_1 = __importDefault(require("../models/defaultVariantCombine"));
const category_1 = __importDefault(require("../models/category"));
const categoryAttribute_1 = __importDefault(require("../models/categoryAttribute"));
const color_1 = __importDefault(require("../models/color"));
const productSlider_1 = __importDefault(require("../models/productSlider"));
const slider_1 = __importDefault(require("../models/slider"));
const image_1 = __importDefault(require("../models/image"));
const sliderImage_1 = __importDefault(require("../models/sliderImage"));
const combine_1 = __importDefault(require("../models/combine"));
const sequelize_1 = require("sequelize");
const helper_1 = require("../system/helper");
const PAGE_SIZE = 6;
class ProductHandler {
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const { page, brand_id, category_id, price, size } = query;
                const sort = res.locals.sort;
                const _size = (size && typeof size === "string" && +size < 12 && +size) ||
                    PAGE_SIZE;
                const _page = (page && typeof page === "string" && +page) || 1;
                const where = {};
                const combineWhere = {};
                const order = [["id", "DESC"]];
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
                const { count, rows } = yield product_2.default.findAndCountAll({
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
                const product = yield product_2.default.findByPk(productId, {
                    include: [
                        {
                            model: category_1.default,
                            as: "category",
                            include: [
                                {
                                    model: categoryAttribute_1.default,
                                    as: "attributes",
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
                                },
                            ],
                        },
                        product_2.default.associations.default_variant,
                        product_2.default.associations.combines,
                        {
                            model: color_1.default,
                            as: "colors",
                            include: [
                                {
                                    model: productSlider_1.default,
                                    as: "product_slider",
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
                        },
                        product_2.default.associations.attributes,
                        product_2.default.associations.description,
                    ],
                });
                return (0, myResponse_1.default)(res, true, "get product successful", 200, product);
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
                if (!body.category_id || !body.brand_id)
                    throw new BadRequest_1.default("");
                const founded = yield product_2.default.findOne({
                    where: {
                        name_ascii: body.name_ascii,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Product name already exist", 409);
                const newProduct = yield product_2.default.create(body);
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
                const item = yield product_2.default.findByPk(productId);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                const founded = yield product_2.default.findOne({
                    where: {
                        name_ascii: body.name_ascii,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Product name already exist", 409);
                // if (value.error) throw new BadRequest(value.error.message);
                yield item.update(body);
                yield product_2.default.update(body, { where: { id: +productId } });
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
            const { count, rows } = yield product_2.default.findAndCountAll({
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
                    name_ascii: { [sequelize_1.Op.like]: `${(0, helper_1.generateId)(q)}%` },
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
                const item = yield product_2.default.findByPk(productId);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                item.destroy();
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
