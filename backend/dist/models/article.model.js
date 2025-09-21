"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModel = void 0;
const mongoose_1 = require("mongoose");
const slug_1 = require("../utils/slug");
const articleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    },
    commentsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
articleSchema.pre('validate', async function handleSlug(next) {
    if (!this.isModified('title') && this.slug) {
        next();
        return;
    }
    const baseSlug = (0, slug_1.generateSlug)(this.title);
    let candidate = baseSlug;
    const Article = this.constructor;
    let exists = await Article.findOne({ slug: candidate, _id: { $ne: this._id } });
    let suffix = 1;
    while (exists) {
        candidate = `${baseSlug}-${suffix++}`;
        exists = await Article.findOne({ slug: candidate, _id: { $ne: this._id } });
    }
    this.slug = candidate;
    next();
});
articleSchema.pre('save', function handlePublished(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});
exports.ArticleModel = (0, mongoose_1.model)('Article', articleSchema);
//# sourceMappingURL=article.model.js.map