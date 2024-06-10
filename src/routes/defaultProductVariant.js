"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const defaultProductVariant_1 = __importDefault(require("../handlers/defaultProductVariant"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const defaultProductVariantRouter = (0, express_1.Router)();
defaultProductVariantRouter.use((0, requireRole_1.default)('ADMIN'));
defaultProductVariantRouter.put("/:id", defaultProductVariant_1.default.update);
exports.default = defaultProductVariantRouter;
