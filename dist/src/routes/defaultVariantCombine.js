"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defaultVariantCombine_1 = __importDefault(require("../handlers/defaultVariantCombine"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const defaultVariantCombineRouter = (0, express_1.Router)();
defaultVariantCombineRouter.use(requireAuth_1.default, (0, requireRole_1.default)('ADMIN'));
defaultVariantCombineRouter.put("/:id", defaultVariantCombine_1.default.update);
exports.default = defaultVariantCombineRouter;
