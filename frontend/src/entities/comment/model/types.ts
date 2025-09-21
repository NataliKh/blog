export interface CommentAuthor {
  _id: string;
  name: string;
  email: string;
}

export interface Comment {
  id: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  article: string;
  author: CommentAuthor;
  createdAt: string;
}
