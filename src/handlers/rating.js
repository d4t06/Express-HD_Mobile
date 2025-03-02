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
const productRating_1 = __importDefault(require("../models/productRating"));
const helper_1 = require("../system/helper");
const myResponse_1 = __importDefault(require("../system/myResponse"));
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../config/sequelize"));
const rating_1 = __importDefault(require("../schemas/rating"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
class RatingHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = rating_1.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                yield productRating_1.default.create(body);
                return (0, myResponse_1.default)(res, true, "Rate successful", 200);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getProductRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, product_id, size, approved } = req.query;
                const where = {};
                const _page = (typeof page === "string" && +page) || 1;
                const _size = (typeof size === "string" && +size < 12 && +size) || 12;
                const _productId = typeof product_id === "string" && +product_id;
                const _approved = typeof +approved === "number" && [0, 1].includes(+approved)
                    ? +approved
                    : 1;
                // apply  where condition
                where.approve = !!_approved;
                if (_productId)
                    where.product_id = _productId;
                const { rows, count } = yield productRating_1.default.findAndCountAll({
                    offset: (_page - 1) * _size,
                    limit: _size,
                    where,
                    order: [["id", "DESC"]],
                });
                if (rows.length) {
                    rows.forEach((item) => {
                        item["date_convert"] = (0, helper_1.countDateDiff)(item["createdAt"]);
                    });
                }
                const resData = {
                    product_id: _productId,
                    ratings: rows,
                    page: _page,
                    size: _size,
                    approved: _approved,
                    count,
                };
                return (0, myResponse_1.default)(res, true, "Get product rating successful", 200, resData);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAverage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { product_id } = req.query;
                const _productId = product_id && typeof product_id === "string" && +product_id;
                if (!_productId)
                    throw new BadRequest_1.default("");
                const average = yield productRating_1.default.findOne({
                    attributes: [
                        [sequelize_1.Sequelize.fn("AVG", sequelize_2.default.col("rate")), "average"],
                    ],
                    where: { product_id: _productId, approve: 1 },
                });
                return (0, myResponse_1.default)(res, true, "Get rating average successful", 200, average);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new RatingHandler();
