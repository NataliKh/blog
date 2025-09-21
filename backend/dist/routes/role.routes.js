"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const role_controller_1 = require("../controllers/role.controller");
const router = (0, express_1.Router)();
const ensureAdmin = [auth_middleware_1.authenticate, (0, authorize_middleware_1.authorize)({ roles: ['admin'] })];
router.get('/', ensureAdmin, role_controller_1.listRoles);
router.post('/', ensureAdmin, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Role name is required'),
    (0, express_validator_1.body)('permissions').isArray().withMessage('Permissions must be an array')
], role_controller_1.createRole);
router.patch('/:id', ensureAdmin, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid role id'),
    (0, express_validator_1.body)('name').optional().isString(),
    (0, express_validator_1.body)('permissions').optional().isArray()
], role_controller_1.updateRole);
router.delete('/:id', ensureAdmin, [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid role id')], role_controller_1.deleteRole);
exports.default = router;
//# sourceMappingURL=role.routes.js.map