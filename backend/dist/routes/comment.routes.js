"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const comment_controller_1 = require("../controllers/comment.controller");
const router = (0, express_1.Router)();
router.get('/', [(0, express_validator_1.query)('articleId').optional().isMongoId().withMessage('Invalid article id')], comment_controller_1.listComments);
router.post('/', auth_middleware_1.authenticate, [
    (0, express_validator_1.body)('articleId').isMongoId().withMessage('Invalid article id'),
    (0, express_validator_1.body)('content').isLength({ min: 2 }).withMessage('Content is too short')
], comment_controller_1.createComment);
router.patch('/:id/status', auth_middleware_1.authenticate, (0, authorize_middleware_1.authorize)({ roles: ['admin', 'editor'] }), [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid comment id'),
    (0, express_validator_1.body)('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], comment_controller_1.moderateComment);
router.delete('/:id', auth_middleware_1.authenticate, [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid comment id')], comment_controller_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map