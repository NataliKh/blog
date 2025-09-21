"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const authorize = (options = {}) => {
    const { roles = [], permissions = [] } = options;
    return (0, async_handler_1.asyncHandler)((req, _res, next) => {
        if (!req.user) {
            throw new api_error_1.ApiError(401, 'Authentication required');
        }
        const roleAllowed = roles.length === 0 || roles.includes(req.user.role);
        const permissionsAllowed = permissions.every((permission) => req.user?.permissions.includes(permission));
        if (!roleAllowed || !permissionsAllowed) {
            throw new api_error_1.ApiError(403, 'Forbidden');
        }
        next();
    });
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.middleware.js.map