"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadRequest extends Error {
    constructor(message) {
        super(message || "bad request");
    }
}
exports.default = BadRequest;
