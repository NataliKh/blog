import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';
import { UserModel } from '../models/user.model';
import { RoleModel, RoleDocument } from '../models/role.model';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  const users = await UserModel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('role')
    .select('-password')
    .lean()
    .exec();

  res.json({
    data: users.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: (user.role as RoleDocument | undefined)?.name ?? 'unknown',
      bio: user.bio ?? null,
      avatarUrl: user.avatarUrl ?? null
    }))
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  if (req.user.role !== 'admin' && req.user.id !== id) {
    throw new ApiError(403, 'Forbidden');
  }

  const user = await UserModel.findById(id).populate('role').select('-password').lean().exec();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: (user.role as RoleDocument | undefined)?.name ?? 'unknown',
    bio: user.bio ?? null,
    avatarUrl: user.avatarUrl ?? null
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { id } = req.params;

  if (!req.user) {
    throw new ApiError(401, 'Authentication required');
  }

  const body = req.body as {
    name?: string;
    bio?: string;
    avatarUrl?: string;
    role?: string;
  };

  if (req.user.role !== 'admin' && req.user.id !== id) {
    throw new ApiError(403, 'Forbidden');
  }

  const update: Record<string, unknown> = {};

  if (body.name !== undefined) update.name = body.name;
  if (body.bio !== undefined) update.bio = body.bio;
  if (body.avatarUrl !== undefined) update.avatarUrl = body.avatarUrl;

  if (body.role) {
    if (req.user.role !== 'admin') {
      throw new ApiError(403, 'Only administrators can change roles');
    }

    const role = await RoleModel.findOne({ name: body.role }).exec();

    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    update.role = role.id;
  }

  const updated = await UserModel.findByIdAndUpdate(id, update, {
    new: true
  })
    .populate('role')
    .select('-password')
    .lean()
    .exec();

  if (!updated) {
    throw new ApiError(404, 'User not found');
  }

  res.json({
    id: String(updated._id),
    name: updated.name,
    email: updated.email,
    role: (updated.role as RoleDocument | undefined)?.name ?? 'unknown',
    bio: updated.bio ?? null,
    avatarUrl: updated.avatarUrl ?? null
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.user?.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  const user = await UserModel.findByIdAndDelete(id).exec();

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(204).send();
});
