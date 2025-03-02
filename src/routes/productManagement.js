"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sortMiddleware_1 = __importDefault(require("../middlewares/sortMiddleware"));
const productManagement_1 = __importDefault(require("../handlers/productManagement"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const productManagementRouter = (0, express_1.Router)();
productManagementRouter.use(requireAuth_1.default, (0, requireRole_1.default)("ADMIN"));
productManagementRouter.get("/products", sortMiddleware_1.default, productManagement_1.default.findAll);
productManagementRouter.get("/search", productManagement_1.default.search);
productManagementRouter.get("/duplicate/:id", productManagement_1.default.duplicate);
productManagementRouter.post("/json-import", productManagement_1.default.JSONImport);
exports.default = productManagementRouter;
