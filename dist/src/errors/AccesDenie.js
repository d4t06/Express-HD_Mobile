"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccessDenied extends Error {
    constructor(message) {
        super(message ||
            "Insufficient privilege or the access token provided is expired, revoked");
    }
}
exports.default = AccessDenied;
