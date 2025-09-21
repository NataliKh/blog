import { api } from '../../../shared/api/base';
import { Article, ArticleSummary, ArticleStatus } from '../model/types';

interface Pagination<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const fetchArticles = async (
  params: Partial<{ page: number; limit: number; status: ArticleStatus; tag: string; author: string }>
): Promise<Pagination<ArticleSummary>> => {
  const { data } = await api.get<Pagination<ArticleSummary>>('/articles', { params });
  return data;
};

export const fetchArticle = async (slug: string): Promise<Article> => {
  const { data } = await api.get<Record<string, unknown>>(`/articles/${slug}`);

  return {
    id: String((data.id as string | undefined) ?? (data._id as string | undefined) ?? ''),
    slug: String(data.slug ?? ''),
    title: String(data.title ?? ''),
    content: String(data.content ?? ''),
    excerpt: (data.excerpt as string | null) ?? null,
    status: (data.status as ArticleStatus) ?? 'draft',
    tags: (data.tags as string[]) ?? [],
    author: (data.author as Article['author']) ?? { _id: '', name: '', email: '' },
    publishedAt: (data.publishedAt as string | null) ?? null,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: (data.updatedAt as string | undefined) ?? undefined
  };
};

export const createArticle = async (
  payload: Partial<{ title: string; content: string; excerpt?: string; tags?: string[]; status?: ArticleStatus }>
) => {
  const { data } = await api.post('/articles', payload);
  return data as { id: string; slug: string };
};

export const updateArticle = async (
  id: string,
  payload: Partial<{ title: string; content: string; excerpt?: string; tags?: string[]; status?: ArticleStatus }>
) => {
  const { data } = await api.patch(`/articles/${id}`, payload);
  return data as { id: string; slug: string };
};

export const deleteArticle = async (id: string): Promise<void> => {
  await api.delete(`/articles/${id}`);
};
