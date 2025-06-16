"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../handlers/auth"));
const authRouter = (0, express_1.Router)();
authRouter.post("/login", auth_1.default.login);
authRouter.post("/register", auth_1.default.register);
authRouter.post("/refresh", auth_1.default.refreshToken);
authRouter.get("/logout", auth_1.default.logout);
exports.default = authRouter;
