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
const brand_1 = __importDefault(require("../schemas/brand"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const brand_2 = __importDefault(require("../models/brand"));
const helper_1 = require("../system/helper");
class BrandHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = brand_1.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const founded = yield brand_2.default.findOne({
                    where: {
                        name_ascii: (0, helper_1.generateId)(body.name),
                        category_id: body.category_id,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Brand already exist", 409);
                const brand = yield brand_2.default.create(Object.assign(Object.assign({}, body), { name_ascii: (0, helper_1.generateId)(body.name) }));
                return (0, myResponse_1.default)(res, true, "add brand successful", 200, brand);
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
                const value = brand_1.default.validate(body);
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const founded = yield brand_2.default.findOne({
                    where: {
                        name_ascii: body.name_ascii,
                    },
                });
                if (founded)
                    return (0, myResponse_1.default)(res, false, "Category already exist", 409);
                const oldBrand = yield brand_2.default.findByPk(id);
                if (!oldBrand)
                    throw new ObjectNotFound_1.default("");
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                yield brand_2.default.update(body, { where: { id } });
                Object.assign(oldBrand, body);
                return (0, myResponse_1.default)(res, true, "update brand successful", 200, oldBrand);
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
                console.log("check id", id, +id);
                const brand = yield brand_2.default.findByPk(id);
                if (!brand)
                    throw new ObjectNotFound_1.default("");
                brand.destroy({});
                return (0, myResponse_1.default)(res, true, "delete brand successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new BrandHandler();
