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
const sequelize_1 = require("sequelize");
const myResponse_1 = __importDefault(require("../system/myResponse"));
const product_1 = __importDefault(require("../models/product"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const productManagement_1 = __importDefault(require("../services/productManagement"));
const helper_1 = require("../system/helper");
class ProductManagement {
    findAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const { page, category_id, size } = query;
                const sort = res.locals.sort;
                const _size = (size && typeof size === "string" && +size <= 50 && +size) || 50;
                const _page = (page && typeof page === "string" && +page) || 1;
                const where = {};
                const order = [
                    ["id", "DESC"],
                ];
                if (category_id)
                    where.category_id = category_id;
                const { count, rows } = yield product_1.default.findAndCountAll({
                    offset: (_page - 1) * _size,
                    limit: _size,
                    distinct: true,
                    where,
                    order,
                });
                return (0, myResponse_1.default)(res, true, "get all product successful", 200, {
                    products: rows,
                    count,
                    page: _page,
                    size: _size,
                    sort: sort.enable,
                    category_id: +category_id || null,
                    column: sort.enable ? sort.column : null,
                    type: sort.enable ? sort.type : null,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    duplicate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (isNaN(+id))
                    throw new BadRequest_1.default("");
                const newProduct = yield productManagement_1.default.duplicate(+id);
                return (0, myResponse_1.default)(res, true, "Duplicate product successful", 200, newProduct);
            }
            catch (error) {
                next(error);
            }
        });
    }
    JSONImport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                if (!data)
                    throw new BadRequest_1.default("");
                const product = yield productManagement_1.default.jsonImporter(data);
                return (0, myResponse_1.default)(res, true, "JSON import successful", 200, product);
            }
            catch (error) {
                next(error);
            }
        });
    }
    search(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { q } = req.query;
                const { count, rows } = yield product_1.default.findAndCountAll({
                    distinct: true,
                    where: {
                        name_ascii: { [sequelize_1.Op.like]: `%${(0, helper_1.generateId)(q)}%` },
                    },
                });
                return (0, myResponse_1.default)(res, true, "search product successful", 200, {
                    products: rows,
                    count,
                });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new ProductManagement();
