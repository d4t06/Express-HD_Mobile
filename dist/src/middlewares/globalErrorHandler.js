"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectNotFound_1 = __importDefault(require("../errors/ObjectNotFound"));
const BadRequest_1 = __importDefault(require("../errors/BadRequest"));
const jsonwebtoken_1 = require("jsonwebtoken");
const AccesDenie_1 = __importDefault(require("../errors/AccesDenie"));
const myResponse_1 = __importDefault(require("../system/myResponse"));
function errorHandler(error, _req, res, _next) {
    if (error instanceof ObjectNotFound_1.default)
        return (0, myResponse_1.default)(res, false, error.message, 404);
    if (error instanceof BadRequest_1.default)
        return (0, myResponse_1.default)(res, false, error.message, 400);
    if (error instanceof jsonwebtoken_1.TokenExpiredError || error instanceof jsonwebtoken_1.JsonWebTokenError)
        return (0, myResponse_1.default)(res, false, error.message, 401);
    if (error instanceof AccesDenie_1.default)
        return (0, myResponse_1.default)(res, false, error.message, 403);
    return (0, myResponse_1.default)(res, false, error.message, 500);
}
exports.default = errorHandler;
