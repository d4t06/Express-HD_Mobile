"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const color_1 = __importDefault(require("../handlers/color"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const ColorRouter = (0, express_1.Router)();
ColorRouter.use((0, requireRole_1.default)('ADMIN'));
ColorRouter.post("/", color_1.default.add);
ColorRouter.put("/:id", color_1.default.update);
ColorRouter.delete("/:id", color_1.default.delete);
exports.default = ColorRouter;
