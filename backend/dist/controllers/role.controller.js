"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.listRoles = void 0;
const express_validator_1 = require("express-validator");
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const role_model_1 = require("../models/role.model");
exports.listRoles = (0, async_handler_1.asyncHandler)(async (_req, res) => {
    const roles = await role_model_1.RoleModel.find().lean().exec();
    res.json({
        data: roles.map((role) => ({
            id: String(role._id),
            name: role.name,
            permissions: role.permissions
        }))
    });
});
exports.createRole = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { name, permissions } = req.body;
    const existing = await role_model_1.RoleModel.findOne({ name }).exec();
    if (existing) {
        throw new api_error_1.ApiError(409, 'Role name already exists');
    }
    const role = await role_model_1.RoleModel.create({ name, permissions });
    res.status(201).json({
        id: role.id,
        name: role.name,
        permissions: role.permissions
    });
});
exports.updateRole = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { id } = req.params;
    const { name, permissions } = req.body;
    const update = {};
    if (name)
        update.name = name;
    if (permissions)
        update.permissions = permissions;
    const role = await role_model_1.RoleModel.findByIdAndUpdate(id, update, { new: true }).lean().exec();
    if (!role) {
        throw new api_error_1.ApiError(404, 'Role not found');
    }
    res.json({
        id: String(role._id),
        name: role.name,
        permissions: role.permissions
    });
});
exports.deleteRole = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const role = await role_model_1.RoleModel.findByIdAndDelete(id).exec();
    if (!role) {
        throw new api_error_1.ApiError(404, 'Role not found');
    }
    res.status(204).send();
});
//# sourceMappingURL=role.controller.js.map