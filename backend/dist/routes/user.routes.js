"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, (0, authorize_middleware_1.authorize)({ roles: ['admin'] }), user_controller_1.getUsers);
router.get('/:id', auth_middleware_1.authenticate, [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid user id')], user_controller_1.getUser);
router.patch('/:id', auth_middleware_1.authenticate, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid user id'),
    (0, express_validator_1.body)('name').optional().isLength({ min: 2 }),
    (0, express_validator_1.body)('bio').optional().isLength({ min: 2 }),
    (0, express_validator_1.body)('avatarUrl').optional().isURL(),
    (0, express_validator_1.body)('role').optional().isString()
], user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.authenticate, (0, authorize_middleware_1.authorize)({ roles: ['admin'] }), [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid user id')], user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map