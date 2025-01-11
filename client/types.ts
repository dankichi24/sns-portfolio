// types.ts

export interface Post {
  id: number;
  content: string;
  image?: string;
  createdAt: string;
  user: {
    userId: number;
    username: string;
    image?: string; // プロフィール画像
  };
  liked: boolean;
  likeCount: number;
}
