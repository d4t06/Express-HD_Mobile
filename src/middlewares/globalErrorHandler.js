"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const jsonwebtoken_1 = require("jsonwebtoken");
const AccesDenie_1 = __importDefault(require("../errors/AccesDenie"));
function errorHandler(error, _req, res, _next) {
    if (error instanceof ObjectNotFound_1.default)
        return res.status(404).json({ flag: false, message: error.message, code: 404 });
    if (error instanceof BadRequest_1.default)
        return res.status(400).json({ flag: false, message: error.message, code: 400 });
    if (error instanceof jsonwebtoken_1.TokenExpiredError || error instanceof jsonwebtoken_1.JsonWebTokenError)
        return res.status(401).json({ flag: false, message: error.message, code: 401 });
    if (error instanceof AccesDenie_1.default)
        return res.status(403).json({ flag: false, message: error.message, code: 403 });
    console.log(error);
    return res
        .status(500)
        .json({ flag: false, message: "Some things went wrong", code: 500 });
}
exports.default = errorHandler;
