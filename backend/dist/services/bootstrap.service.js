"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const role_model_1 = require("../models/role.model");
const roles_1 = require("../constants/roles");
const bootstrap = async () => {
    const existingRoles = await role_model_1.RoleModel.find().lean().exec();
    if (existingRoles.length === 0) {
        await role_model_1.RoleModel.insertMany(roles_1.defaultRoles);
    }
};
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.service.js.map