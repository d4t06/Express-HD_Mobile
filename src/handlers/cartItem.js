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
const cartItem_1 = __importDefault(require("../models/cartItem"));
const combine_1 = __importDefault(require("../models/combine"));
const myResponse_1 = __importDefault(require("../system/myResponse"));
const cartItem_2 = __importDefault(require("../schemas/cartItem"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const AccesDenie_1 = __importDefault(require("../errors/AccesDenie"));
const product_1 = __importDefault(require("../models/product"));
class cartItemHandler {
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                const { username } = req.params;
                const cartItem = yield cartItem_1.default.findAll({
                    where: {
                        username,
                    },
                    include: [
                        {
                            model: product_1.default,
                            as: "product",
                            include: [product_1.default.associations.variants, product_1.default.associations.colors],
                        },
                    ],
                });
                const data = [];
                try {
                    for (var _d = true, cartItem_3 = __asyncValues(cartItem), cartItem_3_1; cartItem_3_1 = yield cartItem_3.next(), _a = cartItem_3_1.done, !_a; _d = true) {
                        _c = cartItem_3_1.value;
                        _d = false;
                        let item = _c;
                        const combine = yield combine_1.default.findOne({
                            where: {
                                variant_id: item.variant_id,
                                color_id: item.color_id,
                            },
                        });
                        if (combine) {
                            data.push({ item, price: combine.price });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = cartItem_3.return)) yield _b.call(cartItem_3);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return (0, myResponse_1.default)(res, true, "get all cart item successful", 200, data);
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
                const value = cartItem_2.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                if (body.username !== res.locals.user.username)
                    throw new AccesDenie_1.default("");
                const foundedCartItem = yield cartItem_1.default.findOne({
                    where: {
                        username: body.username,
                        product_id: body.product_id,
                        variant_id: body.variant_id,
                        color_id: body.color_id,
                    },
                });
                if (foundedCartItem)
                    return (0, myResponse_1.default)(res, true, "add cart item successful", 200);
                yield cartItem_1.default.create(body);
                return (0, myResponse_1.default)(res, true, "add cart item successful", 200);
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = cartItem_2.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const combine = yield combine_1.default.findOne({
                    where: {
                        color_id: body.color_id,
                        variant_id: body.variant_id,
                    },
                });
                if (!combine)
                    throw new ObjectNotFound_1.default("");
                yield cartItem_1.default.update(body, {
                    where: {
                        id: req.params.id,
                    },
                });
                return (0, myResponse_1.default)(res, true, "update cart item successful", 200, combine.price);
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
                const brand = yield cartItem_1.default.findByPk(id);
                if (!brand)
                    throw new ObjectNotFound_1.default("");
                brand.destroy();
                return (0, myResponse_1.default)(res, true, "delete cart item successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new cartItemHandler();
