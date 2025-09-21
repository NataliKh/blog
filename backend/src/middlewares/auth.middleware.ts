import { asyncHandler } from '../utils/async-handler';
import { ApiError } from '../utils/api-error';
import { verifyAccessToken } from '../utils/jwt';
import { UserModel } from '../models/user.model';
import { RoleModel } from '../models/role.model';

const extractToken = (header?: string): string | null => {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req.headers.authorization ?? undefined);

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  const payload = verifyAccessToken(token);
  const user = await UserModel.findById(payload.id).populate('role').exec();

  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  const role = await RoleModel.findById(user.role).exec();

  if (!role) {
    throw new ApiError(403, 'Role not found');
  }

  req.user = {
    id: user.id,
    email: user.email,
    role: role.name,
    permissions: role.permissions
  };

  next();
});
