"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Forbiden extends Error {
    constructor(message) {
        super(message ||
            "Forbiden");
    }
}
exports.default = Forbiden;
