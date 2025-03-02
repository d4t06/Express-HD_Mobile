"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ratingManagement_1 = __importDefault(require("../handlers/ratingManagement"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const ratingManagementRouter = (0, express_1.Router)();
ratingManagementRouter.use(requireAuth_1.default, (0, requireRole_1.default)("ADMIN"));
ratingManagementRouter.put("/", ratingManagement_1.default.approve);
ratingManagementRouter.delete("/:id", ratingManagement_1.default.delete);
exports.default = ratingManagementRouter;
