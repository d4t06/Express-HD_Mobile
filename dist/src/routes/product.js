"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("../handlers/product"));
const sortMiddleware_1 = __importDefault(require("../middlewares/sortMiddleware"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const productRouter = (0, express_1.Router)();
productRouter.get("/search", sortMiddleware_1.default, product_1.default.search);
productRouter.get("/:productId", product_1.default.findOne);
// productRouter.use();
productRouter.get("/", sortMiddleware_1.default, product_1.default.findAll);
productRouter.use((0, requireRole_1.default)("ADMIN"));
productRouter.post("/", product_1.default.add);
productRouter.put("/:productId", product_1.default.update);
productRouter.delete("/:productId", product_1.default.delete);
exports.default = productRouter;
