"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
const jwt_1 = require("../utils/jwt");
const type_guards_1 = require("../utils/type-guards");
exports.register = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { name, email, password } = req.body;
    const existing = await user_model_1.UserModel.findOne({ email }).exec();
    if (existing) {
        throw new api_error_1.ApiError(409, 'Email already registered');
    }
    const role = await role_model_1.RoleModel.findOne({ name: 'user' }).exec();
    if (!role) {
        throw new api_error_1.ApiError(500, 'Default role is missing');
    }
    const user = await user_model_1.UserModel.create({
        name,
        email,
        password,
        role: role.id
    });
    const token = (0, jwt_1.signAccessToken)({
        id: user.id,
        email: user.email,
        role: role.name,
        permissions: role.permissions
    });
    res.status(201).json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: role.name
        }
    });
});
exports.login = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { email, password } = req.body;
    const user = await user_model_1.UserModel.findOne({ email }).populate('role').exec();
    if (!user) {
        throw new api_error_1.ApiError(401, 'Invalid credentials');
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new api_error_1.ApiError(401, 'Invalid credentials');
    }
    const roleDoc = (0, type_guards_1.isRoleDocument)(user.role) ? user.role : null;
    if (!roleDoc) {
        throw new api_error_1.ApiError(403, 'Role is missing');
    }
    const token = (0, jwt_1.signAccessToken)({
        id: user.id,
        email: user.email,
        role: roleDoc.name,
        permissions: roleDoc.permissions
    });
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: roleDoc.name
        }
    });
});
exports.getProfile = (0, async_handler_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const user = await user_model_1.UserModel.findById(req.user.id).populate('role').exec();
    if (!user) {
        throw new api_error_1.ApiError(404, 'User not found');
    }
    const roleDoc = (0, type_guards_1.isRoleDocument)(user.role) ? user.role : null;
    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleDoc?.name ?? 'unknown',
        bio: user.bio,
        avatarUrl: user.avatarUrl
    });
});
//# sourceMappingURL=auth.controller.js.map