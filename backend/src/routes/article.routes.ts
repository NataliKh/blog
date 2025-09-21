import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import {
  createArticle,
  listArticles,
  getArticle,
  updateArticle,
  deleteArticle
} from '../controllers/article.controller';

const router = Router();

router.get('/', listArticles);
router.get('/:slug', getArticle);

router.post(
  '/',
  authenticate,
  authorize({ roles: ['admin', 'editor'] }),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('tags').optional().isArray(),
    body('status').optional().isIn(['draft', 'published', 'archived'])
  ],
  createArticle
);

router.patch(
  '/:id',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid article id'),
    body('title').optional().isLength({ min: 3 }),
    body('content').optional().isLength({ min: 10 }),
    body('tags').optional().isArray(),
    body('status').optional().isIn(['draft', 'published', 'archived'])
  ],
  updateArticle
);

router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid article id')],
  deleteArticle
);

export default router;
