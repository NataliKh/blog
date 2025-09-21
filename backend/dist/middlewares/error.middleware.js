"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const api_error_1 = require("../utils/api-error");
const errorHandler = (err, _req, res, _next) => {
    const defaultMessage = 'Internal server error';
    if (err instanceof api_error_1.ApiError) {
        res.status(err.statusCode).json({ message: err.message });
        return;
    }
    if (err instanceof Error) {
        res.status(500).json({ message: err.message || defaultMessage });
        return;
    }
    res.status(500).json({ message: defaultMessage });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map