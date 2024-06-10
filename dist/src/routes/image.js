"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_1 = __importDefault(require("../handlers/image"));
const multer_1 = __importDefault(require("multer"));
const requireRole_1 = __importDefault(require("../middlewares/requireRole"));
const imageRouter = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
imageRouter.get("/", image_1.default.findAll);
imageRouter.use((0, requireRole_1.default)('ADMIN'));
imageRouter.post("/", upload.single("image"), image_1.default.add);
imageRouter.delete("/:id", image_1.default.delete);
exports.default = imageRouter;
