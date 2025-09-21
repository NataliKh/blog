import { api } from '../../../shared/api/base';
import { Comment } from '../model/types';

export const fetchComments = async (articleId: string): Promise<Comment[]> => {
  const { data } = await api.get<{ data: Comment[] }>('/comments', {
    params: { articleId }
  });

  return data.data;
};

export const createComment = async (payload: { articleId: string; content: string }): Promise<Comment> => {
  const { data } = await api.post<Comment>('/comments', payload);
  return {
    ...data,
    article: payload.articleId
  } as Comment;
};

export const deleteComment = async (id: string): Promise<void> => {
  await api.delete(`/comments/${id}`);
};

export const moderateComment = async (id: string, status: Comment['status']): Promise<Comment> => {
  const { data } = await api.patch<Comment>(`/comments/${id}/status`, { status });
  return data;
};
