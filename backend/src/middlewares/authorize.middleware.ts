import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';

export const authorize = (options: { roles?: string[]; permissions?: string[] } = {}) => {
  const { roles = [], permissions = [] } = options;

  return asyncHandler((req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    const roleAllowed = roles.length === 0 || roles.includes(req.user.role);
    const permissionsAllowed = permissions.every((permission) =>
      req.user?.permissions.includes(permission)
    );

    if (!roleAllowed || !permissionsAllowed) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  });
};
