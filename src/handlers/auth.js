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
const user_1 = __importDefault(require("../schemas/user"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const user_2 = __importDefault(require("../models/user"));
const myResponse_1 = __importDefault(require("../system/myResponse"));
// import bcrypt from "bcrypt";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const ACCESS_TOKEN_EXPIRE = "1h";
const REFRESH_TOKEN_EXPIRE = "30d";
class AuthHandler {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = user_1.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const user = yield user_2.default.findOne({
                    where: {
                        username: body.username,
                    },
                });
                if (!user)
                    return (0, myResponse_1.default)(res, false, "username or password is not correct", 401);
                // const isCorrectPassword = await bcrypt.compare(body.password, user.password);
                const isCorrectPassword = body.password === user.password;
                if (!isCorrectPassword)
                    return (0, myResponse_1.default)(res, false, "username or password is not correct", 401);
                const token = jsonwebtoken_1.default.sign({
                    username: user.username,
                    role: user.role,
                }, process.env.JWT_SECRET, {
                    expiresIn: ACCESS_TOKEN_EXPIRE,
                });
                const refreshToken = jsonwebtoken_1.default.sign({
                    username: user.username,
                    role: user.role,
                }, process.env.JWT_SECRET, {
                    expiresIn: REFRESH_TOKEN_EXPIRE,
                });
                res.cookie("refresh_token", refreshToken, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    secure: process.env.NODE_ENV === "production",
                });
                return (0, myResponse_1.default)(res, true, "login successful", 200, {
                    userInfo: {
                        username: user.username,
                        role: user.role,
                    },
                    token,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const value = user_1.default.validate(body);
                if (value.error)
                    throw new BadRequest_1.default(value.error.message);
                const user = yield user_2.default.findOne({
                    where: {
                        username: body.username,
                    },
                    // raw: true, => then res = 'role_data.id' not role_data: {id: }
                });
                if (user)
                    return (0, myResponse_1.default)(res, false, "username already exist", 409);
                // const salt = await bcrypt.genSalt(10);
                // const hashPassword = await bcrypt.hash(body.password, salt);
                yield user_2.default.create({
                    username: body.username,
                    password: body.password,
                    role: "USER",
                });
                return (0, myResponse_1.default)(res, true, "register ok", 200);
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const cookies = req.cookies;
            if (!cookies.jwt)
                throw new BadRequest_1.default("cookie not provided");
            res.clearCookie("jwt");
            return res.sendStatus(204);
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                const refreshToken = cookies["refresh_token"];
                if (!refreshToken)
                    throw new BadRequest_1.default("cookie not provided");
                const decode = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
                const user = yield user_2.default.findOne({
                    where: { username: decode.username },
                });
                if (!user)
                    throw new ObjectNotFound_1.default("");
                const newToken = jsonwebtoken_1.default.sign({
                    username: decode.username,
                    role: decode.role,
                }, "nguyenhuudat", {
                    expiresIn: ACCESS_TOKEN_EXPIRE,
                });
                return (0, myResponse_1.default)(res, true, "RefreshToken ok", 200, {
                    userInfo: {
                        username: decode.username,
                        role: decode.role,
                    },
                    token: newToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AuthHandler();
