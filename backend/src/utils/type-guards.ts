import { RoleDocument } from '../models/role.model';

export const isRoleDocument = (value: unknown): value is RoleDocument => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'name' in value && Array.isArray((value as RoleDocument).permissions);
};
