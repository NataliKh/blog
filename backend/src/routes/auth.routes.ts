import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

const emailValidator = body('email').isEmail().withMessage('Email is invalid');
const passwordValidator = body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    emailValidator,
    passwordValidator
  ],
  register
);

router.post('/login', [emailValidator, passwordValidator], login);
router.get('/me', authenticate, getProfile);

export default router;
