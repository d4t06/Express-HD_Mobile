"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryAttribute_1 = __importDefault(require("../handlers/categoryAttribute"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const priceRangeRouter = (0, express_1.Router)();
priceRangeRouter.use((0, requireRole_1.default)('ADMIN'));
priceRangeRouter.post("/", categoryAttribute_1.default.add);
priceRangeRouter.put("/:id", categoryAttribute_1.default.update);
priceRangeRouter.delete("/:id", categoryAttribute_1.default.delete);
exports.default = priceRangeRouter;
