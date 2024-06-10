"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectNotFound extends Error {
    constructor(message) {
        super(message || "Object not found");
    }
}
exports.default = ObjectNotFound;
