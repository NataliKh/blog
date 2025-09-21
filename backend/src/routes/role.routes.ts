import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { listRoles, createRole, updateRole, deleteRole } from '../controllers/role.controller';

const router = Router();

const ensureAdmin = [authenticate, authorize({ roles: ['admin'] })];

router.get('/', ensureAdmin, listRoles);

router.post(
  '/',
  ensureAdmin,
  [
    body('name').notEmpty().withMessage('Role name is required'),
    body('permissions').isArray().withMessage('Permissions must be an array')
  ],
  createRole
);

router.patch(
  '/:id',
  ensureAdmin,
  [
    param('id').isMongoId().withMessage('Invalid role id'),
    body('name').optional().isString(),
    body('permissions').optional().isArray()
  ],
  updateRole
);

router.delete(
  '/:id',
  ensureAdmin,
  [param('id').isMongoId().withMessage('Invalid role id')],
  deleteRole
);

export default router;
