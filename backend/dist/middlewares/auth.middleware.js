"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
const extractToken = (header) => {
    if (!header) {
        return null;
    }
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null;
    }
    return token;
};
exports.authenticate = (0, async_handler_1.asyncHandler)(async (req, _res, next) => {
    const token = extractToken(req.headers.authorization ?? undefined);
    if (!token) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const payload = (0, jwt_1.verifyAccessToken)(token);
    const user = await user_model_1.UserModel.findById(payload.id).populate('role').exec();
    if (!user) {
        throw new api_error_1.ApiError(401, 'User no longer exists');
    }
    const role = await role_model_1.RoleModel.findById(user.role).exec();
    if (!role) {
        throw new api_error_1.ApiError(403, 'Role not found');
    }
    req.user = {
        id: user.id,
        email: user.email,
        role: role.name,
        permissions: role.permissions
    };
    next();
});
//# sourceMappingURL=auth.middleware.js.map