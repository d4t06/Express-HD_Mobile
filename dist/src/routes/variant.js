"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const variant_1 = __importDefault(require("../handlers/variant"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const variantRouter = (0, express_1.Router)();
variantRouter.use(requireAuth_1.default, (0, requireRole_1.default)("ADMIN"));
variantRouter.post("/", variant_1.default.add);
variantRouter.put("/:id", variant_1.default.update);
variantRouter.delete("/:id", variant_1.default.delete);
exports.default = variantRouter;
