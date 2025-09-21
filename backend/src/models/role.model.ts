import { Schema, model, Document } from 'mongoose';

export interface RoleDocument extends Document {
  name: string;
  permissions: string[];
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    permissions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const RoleModel = model<RoleDocument>('Role', roleSchema);
