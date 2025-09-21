"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
const type_guards_1 = require("../utils/type-guards");
exports.getUsers = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const users = await user_model_1.UserModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('role')
        .select('-password')
        .lean()
        .exec();
    res.json({
        data: users.map((user) => {
            const roleDoc = (0, type_guards_1.isRoleDocument)(user.role) ? user.role : null;
            return {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: roleDoc?.name ?? 'unknown',
                bio: user.bio ?? null,
                avatarUrl: user.avatarUrl ?? null
            };
        })
    });
});
exports.getUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    if (req.user.role !== 'admin' && req.user.id !== id) {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    const user = await user_model_1.UserModel.findById(id).populate('role').select('-password').lean().exec();
    if (!user) {
        throw new api_error_1.ApiError(404, 'User not found');
    }
    const roleDoc = (0, type_guards_1.isRoleDocument)(user.role) ? user.role : null;
    res.json({
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: roleDoc?.name ?? 'unknown',
        bio: user.bio ?? null,
        avatarUrl: user.avatarUrl ?? null
    });
});
exports.updateUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { id } = req.params;
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const body = req.body;
    if (req.user.role !== 'admin' && req.user.id !== id) {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    const update = {};
    if (body.name !== undefined)
        update.name = body.name;
    if (body.bio !== undefined)
        update.bio = body.bio;
    if (body.avatarUrl !== undefined)
        update.avatarUrl = body.avatarUrl;
    if (body.role) {
        if (req.user.role !== 'admin') {
            throw new api_error_1.ApiError(403, 'Only administrators can change roles');
        }
        const role = await role_model_1.RoleModel.findOne({ name: body.role }).exec();
        if (!role) {
            throw new api_error_1.ApiError(404, 'Role not found');
        }
        update.role = role.id;
    }
    const updated = await user_model_1.UserModel.findByIdAndUpdate(id, update, {
        new: true
    })
        .populate('role')
        .select('-password')
        .lean()
        .exec();
    if (!updated) {
        throw new api_error_1.ApiError(404, 'User not found');
    }
    const roleDoc = (0, type_guards_1.isRoleDocument)(updated.role) ? updated.role : null;
    res.json({
        id: String(updated._id),
        name: updated.name,
        email: updated.email,
        role: roleDoc?.name ?? 'unknown',
        bio: updated.bio ?? null,
        avatarUrl: updated.avatarUrl ?? null
    });
});
exports.deleteUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (req.user?.role !== 'admin') {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    const user = await user_model_1.UserModel.findByIdAndDelete(id).exec();
    if (!user) {
        throw new api_error_1.ApiError(404, 'User not found');
    }
    res.status(204).send();
});
//# sourceMappingURL=user.controller.js.map