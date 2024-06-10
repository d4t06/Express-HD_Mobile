"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sliderImage_1 = __importDefault(require("../handlers/sliderImage"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const sliderImageRouter = (0, express_1.Router)();
sliderImageRouter.use((0, requireRole_1.default)('ADMIN'));
sliderImageRouter.post("/", sliderImage_1.default.add);
sliderImageRouter.put("/:id", sliderImage_1.default.update);
sliderImageRouter.delete("/:id", sliderImage_1.default.delete);
exports.default = sliderImageRouter;
