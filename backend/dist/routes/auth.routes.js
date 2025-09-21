"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const emailValidator = (0, express_validator_1.body)('email').isEmail().withMessage('Email is invalid');
const passwordValidator = (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');
router.post('/register', [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    emailValidator,
    passwordValidator
], auth_controller_1.register);
router.post('/login', [emailValidator, passwordValidator], auth_controller_1.login);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map