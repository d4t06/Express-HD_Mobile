"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const combine_1 = __importDefault(require("../handlers/combine"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const combineRouter = (0, express_1.Router)();
combineRouter.use(requireAuth_1.default, (0, requireRole_1.default)('ADMIN'));
combineRouter.put("/:id", combine_1.default.update);
exports.default = combineRouter;
