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
// import bcrypt from "bcrypt";
const user_1 = __importDefault(require("../models/user"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const category_1 = __importDefault(require("../models/category"));
const slider_1 = __importDefault(require("../models/slider"));
const categorySlider_1 = __importDefault(require("../models/categorySlider"));
const myResponse_1 = __importDefault(require("../system/myResponse"));
const user_2 = __importDefault(require("../schemas/user"));
const Forbiden_1 = __importDefault(require("../errors/Forbiden"));
class InitController {
    init(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.body;
                const result = user_2.default.validate(user);
                if (result.error)
                    throw new BadRequest_1.default(result.error.message);
                const founded = yield user_1.default.findOne({
                    where: {
                        username: "admin",
                    },
                });
                if (founded)
                    throw new Forbiden_1.default("");
                // const salt = await bcrypt.genSalt(10);
                // const hashPassword = await bcrypt.hash(user.password, salt);
                yield user_1.default.create({
                    password: user.password,
                    username: "admin",
                    role: "ADMIN",
                });
                const newCategory = yield category_1.default.create({
                    name: "Home",
                    name_ascii: "home",
                    hidden: true,
                    attribute_order: "",
                });
                const newSlider = yield slider_1.default.create({ name: "slider for home" });
                yield categorySlider_1.default.create({
                    slider_id: newSlider.id,
                    category_id: newCategory.id,
                });
                return (0, myResponse_1.default)(res, true, "Init successful", 200);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new InitController();
