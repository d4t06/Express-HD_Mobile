"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceRange_1 = __importDefault(require("../handlers/priceRange"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const priceRangeRouter = (0, express_1.Router)();
priceRangeRouter.use((0, requireRole_1.default)('ADMIN'));
priceRangeRouter.post("/", priceRange_1.default.add);
priceRangeRouter.put("/:id", priceRange_1.default.update);
priceRangeRouter.delete("/:id", priceRange_1.default.delete);
exports.default = priceRangeRouter;
