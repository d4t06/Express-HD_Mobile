"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rating_1 = __importDefault(require("../handlers/rating"));
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const ratingRouter = (0, express_1.Router)();
ratingRouter.get("/", rating_1.default.getProductRating);
ratingRouter.get("/avg", rating_1.default.getAverage);
ratingRouter.use(requireAuth_1.default);
ratingRouter.post("/", rating_1.default.add);
exports.default = ratingRouter;
