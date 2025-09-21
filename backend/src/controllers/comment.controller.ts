import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';
import { CommentModel } from '../models/comment.model';
import { ArticleModel } from '../models/article.model';

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const { articleId, content } = req.body as { articleId: string; content: string };

  const article = await ArticleModel.findById(articleId).exec();

  if (!article || article.status !== 'published') {
    throw new ApiError(404, 'Article not found');
  }

  const comment = await CommentModel.create({
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

export const listComments = asyncHandler(async (req: Request, res: Response) => {
  const { articleId } = req.query as { articleId?: string };

  const filters: Record<string, unknown> = {};

  if (articleId) {
    filters.article = articleId;
  }

  if (req.user?.role !== 'admin' && req.user?.role !== 'editor') {
    filters.status = 'approved';
  }

  const comments = await CommentModel.find(filters)
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
      author:
        comment.author && typeof comment.author === 'object'
          ? {
              _id: String((comment.author as { _id?: unknown })._id ?? ''),
              name: (comment.author as { name?: string }).name ?? '???????????',
              email: (comment.author as { email?: string }).email ?? ''
            }
          : null,
      createdAt: comment.createdAt
    }))
  });
});

export const moderateComment = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { id } = req.params;
  const { status } = req.body as { status: 'pending' | 'approved' | 'rejected' };

  const comment = await CommentModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate({ path: 'author', select: 'name email' })
    .lean()
    .exec();

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  res.json({
    id: String(comment._id),
    article: String(comment.article),
    content: comment.content,
    status: comment.status,
    author:
      comment.author && typeof comment.author === 'object'
        ? {
            _id: String((comment.author as { _id?: unknown })._id ?? ''),
            name: (comment.author as { name?: string }).name ?? '???????????',
            email: (comment.author as { email?: string }).email ?? ''
          }
        : null,
    createdAt: comment.createdAt
  });
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const comment = await CommentModel.findById(id).exec();

  if (!comment) {
    throw new ApiError(404, 'Comment not found');
  }

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const isOwner = String(comment.author) === req.user.id;
  const canDelete = req.user.role === 'admin' || req.user.role === 'editor' || isOwner;

  if (!canDelete) {
    throw new ApiError(403, 'Forbidden');
  }

  await comment.deleteOne();

  await ArticleModel.findByIdAndUpdate(comment.article, {
    $inc: { commentsCount: -1 }
  }).exec();

  res.status(204).send();
});
