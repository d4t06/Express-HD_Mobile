"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myResponse_1 = __importDefault(require("../system/myResponse"));
const jwt = require("jsonwebtoken");
function requireRole(requireRole) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = req.headers.authorization;
            if (!auth || !auth.startsWith("Bearer "))
                return (0, myResponse_1.default)(res, false, "Unauthorized", 401);
            const token = auth.split(" ")[1];
            try {
                const decode = jwt.verify(token, "nguyenhuudat");
                console.log("role middleware check: ", decode.role);
                if (!decode.role.includes(requireRole))
                    return (0, myResponse_1.default)(res, false, "Insufficient privilege or the access token provided is expired, revoked", 403);
                next();
            }
            catch (error) {
                return (0, myResponse_1.default)(res, false, "Insufficient privilege or the access token provided is expired, revoked", 403);
            }
        });
    };
}
exports.default = requireRole;
