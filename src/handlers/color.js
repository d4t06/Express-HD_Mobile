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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myResponse_1 = __importDefault(require("../system/myResponse"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const color_1 = __importDefault(require("../schemas/color"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const color_2 = __importDefault(require("../models/color"));
const productSlider_1 = __importDefault(require("../models/productSlider"));
const slider_1 = __importDefault(require("../models/slider"));
const variant_1 = __importDefault(require("../models/variant"));
const combine_1 = __importDefault(require("../models/combine"));
const sliderImage_1 = __importDefault(require("../models/sliderImage"));
const image_1 = __importDefault(require("../models/image"));
const helper_1 = require("../system/helper");
class colorHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                const body = req.body;
                const value = color_1.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const color = yield color_2.default.create(Object.assign(Object.assign({}, body), { name_ascii: (0, helper_1.generateId)(body.name) }));
                // add slider
                const newSlider = yield new slider_1.default({
                    name: `for ${color.product_id} ${color.name_ascii}`,
                }).save();
                yield new productSlider_1.default({
                    color_id: color.id,
                    product_id: color.product_id,
                    slider_id: newSlider.id,
                }).save();
                const variants = yield variant_1.default.findAll({
                    where: {
                        product_id: color.product_id,
                    },
                });
                const newCombines = [];
                try {
                    for (var _d = true, variants_1 = __asyncValues(variants), variants_1_1; variants_1_1 = yield variants_1.next(), _a = variants_1_1.done, !_a; _d = true) {
                        _c = variants_1_1.value;
                        _d = false;
                        const v = _c;
                        const combine = yield new combine_1.default({
                            color_id: color.id,
                            price: 0,
                            quantity: 0,
                            product_id: color.product_id,
                            variant_id: v.id,
                        }).save();
                        newCombines.push(combine);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = variants_1.return)) yield _b.call(variants_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                const newColor = yield color_2.default.findByPk(color.id, {
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
                });
                return (0, myResponse_1.default)(res, true, "add color successful", 200, {
                    color: newColor,
                    combines: newCombines,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const body = req.body;
                const value = color_1.default.validate(body);
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield color_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                yield color_2.default.update(body, { where: { id } });
                Object.assign(item, body);
                return (0, myResponse_1.default)(res, true, "update color successful", 200, item);
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
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield color_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                item.destroy();
                return (0, myResponse_1.default)(res, true, "delete color successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new colorHandler();
