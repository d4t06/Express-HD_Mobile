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
const variant_1 = __importDefault(require("../schemas/variant"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const variant_2 = __importDefault(require("../models/variant"));
const color_1 = __importDefault(require("../models/color"));
const combine_1 = __importDefault(require("../models/combine"));
const defaultVariantCombine_1 = __importDefault(require("../models/defaultVariantCombine"));
class variantHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                const body = req.body;
                const value = variant_1.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const newVariant = yield variant_2.default.create(body);
                const defaultCombine = yield new defaultVariantCombine_1.default({
                    variant_id: newVariant.id,
                }).save();
                const colors = yield color_1.default.findAll({
                    where: {
                        product_id: newVariant.product_id,
                    },
                });
                const newCombines = [];
                try {
                    for (var _d = true, colors_1 = __asyncValues(colors), colors_1_1; colors_1_1 = yield colors_1.next(), _a = colors_1_1.done, !_a; _d = true) {
                        _c = colors_1_1.value;
                        _d = false;
                        const c = _c;
                        const combine = yield new combine_1.default({
                            color_id: c.id,
                            price: 0,
                            quantity: 0,
                            product_id: newVariant.product_id,
                            variant_id: newVariant.id,
                        }).save();
                        newCombines.push(combine);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = colors_1.return)) yield _b.call(colors_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                const newCombineWithAssociation = yield variant_2.default.findByPk(newVariant.id, {
                    include: [variant_2.default.associations.default_combine],
                });
                if (!newCombineWithAssociation)
                    throw new ObjectNotFound_1.default("");
                return (0, myResponse_1.default)(res, true, "add variant successful", 200, {
                    variant: newCombineWithAssociation,
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
                const value = variant_1.default.validate(body);
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield variant_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                yield variant_2.default.update(body, { where: { id } });
                Object.assign(item, body);
                return (0, myResponse_1.default)(res, true, "update variant successful", 200, item);
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
                const item = yield variant_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                item.destroy();
                return (0, myResponse_1.default)(res, true, "delete variant successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new variantHandler();
