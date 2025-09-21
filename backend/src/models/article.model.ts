import { Schema, model, Document, Types } from 'mongoose';
import { generateSlug } from '../utils/slug';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleDocument extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  author: Types.ObjectId;
  status: ArticleStatus;
  publishedAt?: Date;
  commentsCount: number;
}

const articleSchema = new Schema<ArticleDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String
    },
    tags: {
      type: [String],
      default: []
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    publishedAt: {
      type: Date
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

articleSchema.pre<ArticleDocument>('validate', async function handleSlug(next) {
  if (!this.isModified('title') && this.slug) {
    next();
    return;
  }

  const baseSlug = generateSlug(this.title);
  let candidate = baseSlug;
  const Article = this.constructor as typeof ArticleModel;
  let exists = await Article.findOne({ slug: candidate, _id: { $ne: this._id } });
  let suffix = 1;

  while (exists) {
    candidate = `${baseSlug}-${suffix++}`;
    exists = await Article.findOne({ slug: candidate, _id: { $ne: this._id } });
  }

  this.slug = candidate;
  next();
});

articleSchema.pre<ArticleDocument>('save', function handlePublished(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const ArticleModel = model<ArticleDocument>('Article', articleSchema);
