"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const description_1 = __importDefault(require("../handlers/description"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const descriptionRouter = (0, express_1.Router)();
descriptionRouter.use((0, requireRole_1.default)('ADMIN'));
descriptionRouter.put("/:productAscii", description_1.default.update);
exports.default = descriptionRouter;
