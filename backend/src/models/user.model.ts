import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { RoleDocument } from './role.model';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: Types.ObjectId | RoleDocument;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true
    },
    bio: {
      type: String
    },
    avatarUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre<UserDocument>('save', async function handlePassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(this: UserDocument, candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = model<UserDocument>('User', userSchema);
