import { api } from '../../../shared/api/base';
export const fetchArticles = async (params) => {
    const { data } = await api.get('/articles', { params });
    return data;
};
export const fetchArticle = async (slug) => {
    const { data } = await api.get(`/articles/${slug}`);
    return {
        id: String(data.id ?? data._id ?? ''),
        slug: String(data.slug ?? ''),
        title: String(data.title ?? ''),
        content: String(data.content ?? ''),
        excerpt: data.excerpt ?? null,
        status: data.status ?? 'draft',
        tags: data.tags ?? [],
        author: data.author ?? { _id: '', name: '', email: '' },
        publishedAt: data.publishedAt ?? null,
        createdAt: String(data.createdAt ?? new Date().toISOString()),
        updatedAt: data.updatedAt ?? undefined
    };
};
export const createArticle = async (payload) => {
    const { data } = await api.post('/articles', payload);
    return data;
};
export const updateArticle = async (id, payload) => {
    const { data } = await api.patch(`/articles/${id}`, payload);
    return data;
};
export const deleteArticle = async (id) => {
    await api.delete(`/articles/${id}`);
};
