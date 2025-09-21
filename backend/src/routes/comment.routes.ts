import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import {
  createComment,
  listComments,
  moderateComment,
  deleteComment
} from '../controllers/comment.controller';

const router = Router();

router.get(
  '/',
  [query('articleId').optional().isMongoId().withMessage('Invalid article id')],
  listComments
);

router.post(
  '/',
  authenticate,
  [
    body('articleId').isMongoId().withMessage('Invalid article id'),
    body('content').isLength({ min: 2 }).withMessage('Content is too short')
  ],
  createComment
);

router.patch(
  '/:id/status',
  authenticate,
  authorize({ roles: ['admin', 'editor'] }),
  [
    param('id').isMongoId().withMessage('Invalid comment id'),
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
  ],
  moderateComment
);

router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid comment id')],
  deleteComment
);

export default router;
