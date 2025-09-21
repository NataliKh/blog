"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
const assert = (condition, statusCode, message) => {
    if (!condition) {
        throw new ApiError(statusCode, message);
    }
};
exports.assert = assert;
//# sourceMappingURL=api-error.js.map