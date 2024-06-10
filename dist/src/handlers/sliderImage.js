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
const sliderImage_1 = __importDefault(require("../schemas/sliderImage"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const sliderImage_2 = __importDefault(require("../models/sliderImage"));
class sliderImageHandler {
    add(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                body.forEach((sI) => {
                    const value = sliderImage_1.default.validate(sI);
                    if (value.error)
                        throw new BadRequest_1.default(value.error.message);
                });
                const sliderImages = yield sliderImage_2.default.bulkCreate(body);
                return (0, myResponse_1.default)(res, true, "add slider image successful", 200, sliderImages);
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
                const value = sliderImage_1.default.validate(body);
                if (Number.isNaN(+id))
                    throw new BadRequest_1.default("");
                const item = yield sliderImage_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                yield sliderImage_2.default.update(body, { where: { id } });
                return (0, myResponse_1.default)(res, true, "update slider image successful", 200);
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
                const item = yield sliderImage_2.default.findByPk(id);
                if (!item)
                    throw new ObjectNotFound_1.default("");
                item.destroy();
                return (0, myResponse_1.default)(res, true, "delete slider image successful", 200);
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = new sliderImageHandler();
