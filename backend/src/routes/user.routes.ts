import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

router.get('/', authenticate, authorize({ roles: ['admin'] }), getUsers);

router.get(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid user id')],
  getUser
);

router.patch(
  '/:id',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid user id'),
    body('name').optional().isLength({ min: 2 }),
    body('bio').optional().isLength({ min: 2 }),
    body('avatarUrl').optional().isURL(),
    body('role').optional().isString()
  ],
  updateUser
);

router.delete(
  '/:id',
  authenticate,
  authorize({ roles: ['admin'] }),
  [param('id').isMongoId().withMessage('Invalid user id')],
  deleteUser
);

export default router;
