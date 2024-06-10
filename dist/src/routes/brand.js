"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brand_1 = __importDefault(require("../handlers/brand"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const brandRouter = (0, express_1.Router)();
brandRouter.use((0, requireRole_1.default)("ADMIN"));
brandRouter.post("/", brand_1.default.add);
brandRouter.put("/:id", brand_1.default.update);
brandRouter.delete("/:id", brand_1.default.delete);
exports.default = brandRouter;
