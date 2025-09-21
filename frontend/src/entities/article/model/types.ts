export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface ArticleAuthor {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  status: ArticleStatus;
  tags: string[];
  author: ArticleAuthor;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  status: ArticleStatus;
  tags: string[];
  author: ArticleAuthor;
  publishedAt?: string | null;
  createdAt: string;
}
