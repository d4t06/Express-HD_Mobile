"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productAttribute_1 = __importDefault(require("../handlers/productAttribute"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const productAttributeRouter = (0, express_1.Router)();
productAttributeRouter.use((0, requireRole_1.default)('ADMIN'));
productAttributeRouter.post("/", productAttribute_1.default.add);
productAttributeRouter.put("/:id", productAttribute_1.default.update);
exports.default = productAttributeRouter;
