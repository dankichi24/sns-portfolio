// types.ts

export interface Post {
  id: number;
  content: string;
  image?: string;
  user: {
    userId: number; // ユーザーID
    username: string; // ユーザー名
  };
  createdAt: string; // 投稿日時
  liked: boolean; // いいねの状態
  likeCount: number; // いいね数
}
