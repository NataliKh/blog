"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authorize_middleware_1 = require("../middlewares/authorize.middleware");
const article_controller_1 = require("../controllers/article.controller");
const router = (0, express_1.Router)();
router.get('/', article_controller_1.listArticles);
router.get('/:slug', article_controller_1.getArticle);
router.post('/', auth_middleware_1.authenticate, (0, authorize_middleware_1.authorize)({ roles: ['admin', 'editor'] }), [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('tags').optional().isArray(),
    (0, express_validator_1.body)('status').optional().isIn(['draft', 'published', 'archived'])
], article_controller_1.createArticle);
router.patch('/:id', auth_middleware_1.authenticate, [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid article id'),
    (0, express_validator_1.body)('title').optional().isLength({ min: 3 }),
    (0, express_validator_1.body)('content').optional().isLength({ min: 10 }),
    (0, express_validator_1.body)('tags').optional().isArray(),
    (0, express_validator_1.body)('status').optional().isIn(['draft', 'published', 'archived'])
], article_controller_1.updateArticle);
router.delete('/:id', auth_middleware_1.authenticate, [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid article id')], article_controller_1.deleteArticle);
exports.default = router;
//# sourceMappingURL=article.routes.js.map