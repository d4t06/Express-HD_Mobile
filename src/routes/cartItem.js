"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartItem_1 = __importDefault(require("../handlers/cartItem"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const cartItemRouter = (0, express_1.Router)();
cartItemRouter.get("/:username", cartItem_1.default.findAll);
cartItemRouter.use(requireAuth_1.default);
cartItemRouter.post("/", cartItem_1.default.add);
cartItemRouter.put("/:id", cartItem_1.default.update);
cartItemRouter.delete("/:id", cartItem_1.default.delete);
exports.default = cartItemRouter;
