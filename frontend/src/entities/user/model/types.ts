export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bio?: string | null;
  avatarUrl?: string | null;
}
