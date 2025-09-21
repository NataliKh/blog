"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.moderateComment = exports.listComments = exports.createComment = void 0;
const express_validator_1 = require("express-validator");
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const comment_model_1 = require("../models/comment.model");
const article_model_1 = require("../models/article.model");
exports.createComment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const { articleId, content } = req.body;
    const article = await article_model_1.ArticleModel.findById(articleId).exec();
    if (!article || article.status !== 'published') {
        throw new api_error_1.ApiError(404, 'Article not found');
    }
    const comment = await comment_model_1.CommentModel.create({
        article: article.id,
        author: req.user.id,
        content,
        status: 'pending'
    });
    article.commentsCount += 1;
    await article.save();
    res.status(201).json({
        id: comment.id,
        content: comment.content,
        status: comment.status
    });
});
exports.listComments = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { articleId } = req.query;
    const filters = {};
    if (articleId) {
        filters.article = articleId;
    }
    if (req.user?.role !== 'admin' && req.user?.role !== 'editor') {
        filters.status = 'approved';
    }
    const comments = await comment_model_1.CommentModel.find(filters)
        .sort({ createdAt: -1 })
        .populate({ path: 'author', select: 'name email' })
        .lean()
        .exec();
    res.json({
        data: comments.map((comment) => ({
            id: String(comment._id),
            article: String(comment.article),
            content: comment.content,
            status: comment.status,
            author: comment.author && typeof comment.author === 'object'
                ? {
                    _id: String(comment.author._id ?? ''),
                    name: comment.author.name ?? '???????????',
                    email: comment.author.email ?? ''
                }
                : null,
            createdAt: comment.createdAt
        }))
    });
});
exports.moderateComment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { id } = req.params;
    const { status } = req.body;
    const comment = await comment_model_1.CommentModel.findByIdAndUpdate(id, { status }, { new: true })
        .populate({ path: 'author', select: 'name email' })
        .lean()
        .exec();
    if (!comment) {
        throw new api_error_1.ApiError(404, 'Comment not found');
    }
    res.json({
        id: String(comment._id),
        article: String(comment.article),
        content: comment.content,
        status: comment.status,
        author: comment.author && typeof comment.author === 'object'
            ? {
                _id: String(comment.author._id ?? ''),
                name: comment.author.name ?? '???????????',
                email: comment.author.email ?? ''
            }
            : null,
        createdAt: comment.createdAt
    });
});
exports.deleteComment = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const comment = await comment_model_1.CommentModel.findById(id).exec();
    if (!comment) {
        throw new api_error_1.ApiError(404, 'Comment not found');
    }
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const isOwner = String(comment.author) === req.user.id;
    const canDelete = req.user.role === 'admin' || req.user.role === 'editor' || isOwner;
    if (!canDelete) {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    await comment.deleteOne();
    await article_model_1.ArticleModel.findByIdAndUpdate(comment.article, {
        $inc: { commentsCount: -1 }
    }).exec();
    res.status(204).send();
});
//# sourceMappingURL=comment.controller.js.map