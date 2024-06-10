"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Unauthorized extends Error {
    constructor(message) {
        super(message ||
            "Unauthorized");
    }
}
exports.default = Unauthorized;
