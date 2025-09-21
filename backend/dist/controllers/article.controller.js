"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticle = exports.listArticles = exports.createArticle = void 0;
const express_validator_1 = require("express-validator");
const async_handler_1 = require("../utils/async-handler");
const api_error_1 = require("../utils/api-error");
const article_model_1 = require("../models/article.model");
exports.createArticle = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const { title, content, excerpt, tags, status } = req.body;
    const article = await article_model_1.ArticleModel.create({
        title,
        content,
        excerpt,
        tags,
        status: status ?? 'draft',
        author: req.user.id
    });
    res.status(201).json({
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: article.status
    });
});
exports.listArticles = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const status = req.query.status;
    const tag = req.query.tag;
    const author = req.query.author;
    const filters = {};
    if (status) {
        filters.status = status;
    }
    if (tag) {
        filters.tags = tag;
    }
    if (author) {
        filters.author = author;
    }
    if (!req.user) {
        filters.status = 'published';
    }
    const [items, total] = await Promise.all([
        article_model_1.ArticleModel.find(filters)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({ path: 'author', select: 'name email role' })
            .lean()
            .exec(),
        article_model_1.ArticleModel.countDocuments(filters)
    ]);
    res.json({
        data: items.map((article) => ({
            id: String(article._id),
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt ?? null,
            status: article.status,
            tags: article.tags ?? [],
            author: article.author,
            publishedAt: article.publishedAt ?? null,
            createdAt: article.createdAt
        })),
        pagination: {
            page,
            limit,
            total
        }
    });
});
exports.getArticle = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const article = await article_model_1.ArticleModel.findOne({ slug })
        .populate({ path: 'author', select: 'name email role' })
        .lean()
        .exec();
    if (!article) {
        throw new api_error_1.ApiError(404, 'Article not found');
    }
    if (article.status !== 'published' &&
        req.user?.role !== 'admin' &&
        req.user?.id !== String(article.author)) {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    res.json({
        ...article,
        id: String(article._id)
    });
});
exports.updateArticle = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new api_error_1.ApiError(400, 'Validation failed');
    }
    const { id } = req.params;
    const body = req.body;
    const article = await article_model_1.ArticleModel.findById(id);
    if (!article) {
        throw new api_error_1.ApiError(404, 'Article not found');
    }
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const isOwner = String(article.author) === req.user.id;
    const canEdit = req.user.role === 'admin' || isOwner;
    if (!canEdit) {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    if (body.title !== undefined)
        article.title = body.title;
    if (body.content !== undefined)
        article.content = body.content;
    if (body.excerpt !== undefined)
        article.excerpt = body.excerpt;
    if (body.tags !== undefined)
        article.tags = body.tags;
    if (body.status !== undefined)
        article.status = body.status;
    await article.save();
    res.json({
        id: article.id,
        slug: article.slug,
        title: article.title,
        status: article.status,
        updatedAt: article.updatedAt
    });
});
exports.deleteArticle = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const article = await article_model_1.ArticleModel.findById(id).exec();
    if (!article) {
        throw new api_error_1.ApiError(404, 'Article not found');
    }
    if (!req.user) {
        throw new api_error_1.ApiError(401, 'Authentication required');
    }
    const isOwner = String(article.author) === req.user.id;
    const canDelete = req.user.role === 'admin' || isOwner;
    if (!canDelete) {
        throw new api_error_1.ApiError(403, 'Forbidden');
    }
    await article.deleteOne();
    res.status(204).send();
});
//# sourceMappingURL=article.controller.js.map