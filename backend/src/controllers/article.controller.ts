import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';
import { ArticleModel } from '../models/article.model';

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const { title, content, excerpt, tags, status } = req.body as {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
  };

  const article = await ArticleModel.create({
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

export const listArticles = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const status = req.query.status as string | undefined;
  const tag = req.query.tag as string | undefined;
  const author = req.query.author as string | undefined;

  const filters: Record<string, unknown> = {};

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
    ArticleModel.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'author', select: 'name email role' })
      .lean()
      .exec(),
    ArticleModel.countDocuments(filters)
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

export const getArticle = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const article = await ArticleModel.findOne({ slug })
    .populate({ path: 'author', select: 'name email role' })
    .lean()
    .exec();

  if (!article) {
    throw new ApiError(404, 'Article not found');
  }

  if (
    article.status !== 'published' &&
    req.user?.role !== 'admin' &&
    req.user?.id !== String(article.author)
  ) {
    throw new ApiError(403, 'Forbidden');
  }

  res.json({
    ...article,
    id: String(article._id)
  });
});

export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { id } = req.params;
  const body = req.body as {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
    status?: 'draft' | 'published' | 'archived';
  };

  const article = await ArticleModel.findById(id);

  if (!article) {
    throw new ApiError(404, 'Article not found');
  }

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const isOwner = String(article.author) === req.user.id;
  const canEdit = req.user.role === 'admin' || isOwner;

  if (!canEdit) {
    throw new ApiError(403, 'Forbidden');
  }

  if (body.title !== undefined) article.title = body.title;
  if (body.content !== undefined) article.content = body.content;
  if (body.excerpt !== undefined) article.excerpt = body.excerpt;
  if (body.tags !== undefined) article.tags = body.tags;
  if (body.status !== undefined) article.status = body.status;

  await article.save();

  res.json({
    id: article.id,
    slug: article.slug,
    title: article.title,
    status: article.status,
    updatedAt: article.updatedAt
  });
});

export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await ArticleModel.findById(id).exec();

  if (!article) {
    throw new ApiError(404, 'Article not found');
  }

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const isOwner = String(article.author) === req.user.id;
  const canDelete = req.user.role === 'admin' || isOwner;

  if (!canDelete) {
    throw new ApiError(403, 'Forbidden');
  }

  await article.deleteOne();

  res.status(204).send();
});
