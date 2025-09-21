import { Schema, model, Document, Types } from 'mongoose';

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface CommentDocument extends Document {
  article: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  status: CommentStatus;
}

const commentSchema = new Schema<CommentDocument>(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
