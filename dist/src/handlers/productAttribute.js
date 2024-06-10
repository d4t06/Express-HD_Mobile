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
const productAttribute_1 = __importDefault(require("../models/productAttribute"));
const productAttribute_2 = __importDefault(require("../schemas/productAttribute"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
class ProductAttributeHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = productAttribute_2.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const item = yield productAttribute_1.default.create(body);
                return (0, myResponse_1.default)(res, true, "add attribute successful", 200, item);
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
                const value = productAttribute_2.default.validate(body);
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const oldBrand = yield productAttribute_1.default.findByPk(id);
                if (!oldBrand)
                    throw new ObjectNotFound_1.default("");
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                yield productAttribute_1.default.update(body, { where: { id } });
                Object.assign(oldBrand, body);
                return (0, myResponse_1.default)(res, true, "update attribute successful", 200, oldBrand);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ProductAttributeHandler();
