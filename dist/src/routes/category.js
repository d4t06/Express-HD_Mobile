"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = __importDefault(require("../handlers/category"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const router = (0, express_1.Router)();
router.get("/", category_1.default.findAll);
router.use((0, requireRole_1.default)("ADMIN"));
router.post("/", category_1.default.add);
router.put("/:id", category_1.default.update);
router.delete("/:id", category_1.default.delete);
exports.default = router;
