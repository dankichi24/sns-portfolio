export interface Post {
  id: number;
  content: string;
  image?: string;
  createdAt: string;
  user: {
    userId: number;
    username: string;
    image?: string;
  };
  liked: boolean;
  likeCount: number;
  justUpdated?: boolean;
}

export interface Device {
  id: number;
  name: string;
  image: string;
  comment?: string;
  userId: number;
}
