import { api } from '../../../shared/api/base';
export const fetchComments = async (articleId) => {
    const { data } = await api.get('/comments', {
        params: { articleId }
    });
    return data.data;
};
export const createComment = async (payload) => {
    const { data } = await api.post('/comments', payload);
    return {
        ...data,
        article: payload.articleId
    };
};
export const deleteComment = async (id) => {
    await api.delete(`/comments/${id}`);
};
export const moderateComment = async (id, status) => {
    const { data } = await api.patch(`/comments/${id}/status`, { status });
    return data;
};
