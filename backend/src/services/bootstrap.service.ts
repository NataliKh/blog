import { RoleModel } from '../models/role.model';
import { defaultRoles } from '../constants/roles';

export const bootstrap = async (): Promise<void> => {
  const existingRoles = await RoleModel.find().lean().exec();

  if (existingRoles.length === 0) {
    await RoleModel.insertMany(defaultRoles);
  }
};
