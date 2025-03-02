"use strict";
// **** PATH /api/pdf
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pdf_1 = __importDefault(require("../handlers/pdf"));
const pdfRouter = (0, express_1.Router)();
const handler = new pdf_1.default();
pdfRouter.post("", handler.generate);
exports.default = pdfRouter;
