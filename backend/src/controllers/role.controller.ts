import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';
import { RoleModel } from '../models/role.model';

export const listRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await RoleModel.find().lean().exec();

  res.json({
    data: roles.map((role) => ({
      id: String(role._id),
      name: role.name,
      permissions: role.permissions
    }))
  });
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { name, permissions } = req.body as { name: string; permissions: string[] };

  const existing = await RoleModel.findOne({ name }).exec();

  if (existing) {
    throw new ApiError(409, 'Role name already exists');
  }

  const role = await RoleModel.create({ name, permissions });

  res.status(201).json({
    id: role.id,
    name: role.name,
    permissions: role.permissions
  });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed');
  }

  const { id } = req.params;
  const { name, permissions } = req.body as { name?: string; permissions?: string[] };

  const update: Record<string, unknown> = {};

  if (name) update.name = name;
  if (permissions) update.permissions = permissions;

  const role = await RoleModel.findByIdAndUpdate(id, update, { new: true }).lean().exec();

  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  res.json({
    id: String(role._id),
    name: role.name,
    permissions: role.permissions
  });
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const role = await RoleModel.findByIdAndDelete(id).exec();

  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  res.status(204).send();
});
