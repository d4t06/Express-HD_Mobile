"use strict";
// **** PATH /api/init
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const initRouter = (0, express_1.Router)();
const init_1 = __importDefault(require("../handlers/init"));
initRouter.post("", init_1.default.init);
exports.default = initRouter;
