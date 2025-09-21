import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';
import { signAccessToken } from '../utils/jwt';
import { isRoleDocument } from '../utils/type-guards';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existing = await UserModel.findOne({ email }).exec();

  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const role = await RoleModel.findOne({ name: 'user' }).exec();

  if (!role) {
    throw new ApiError(500, 'Default role is missing');
  }

  const user = await UserModel.create({
    name,
    email,
    password,
    role: role.id
  });

  const token = signAccessToken({
    id: user.id,
    email: user.email,
    role: role.name,
    permissions: role.permissions
  });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role.name
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { email, password } = req.body as { email: string; password: string };
  const user = await UserModel.findOne({ email }).populate('role').exec();

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const roleDoc = isRoleDocument(user.role) ? user.role : null;

  if (!roleDoc) {
    throw new ApiError(403, 'Role is missing');
  }

  const token = signAccessToken({
    id: user.id,
    email: user.email,
    role: roleDoc.name,
    permissions: roleDoc.permissions
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleDoc.name
    }
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const user = await UserModel.findById(req.user.id).populate('role').exec();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const roleDoc = isRoleDocument(user.role) ? user.role : null;

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleDoc?.name ?? 'unknown',
    bio: user.bio,
    avatarUrl: user.avatarUrl
  });
});
