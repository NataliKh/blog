"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const role_routes_1 = __importDefault(require("./role.routes"));
const article_routes_1 = __importDefault(require("./article.routes"));
const comment_routes_1 = __importDefault(require("./comment.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/roles', role_routes_1.default);
router.use('/articles', article_routes_1.default);
router.use('/comments', comment_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map