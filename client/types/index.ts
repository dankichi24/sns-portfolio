/**
 * 投稿（Post）データ型
 *
 * @typedef {Object} Post
 * @property {number} id - 投稿ID
 * @property {string} content - 投稿本文
 * @property {string} [image] - 投稿画像URL（省略可）
 * @property {string} createdAt - 投稿日時（ISO文字列）
 * @property {Object} user - 投稿者情報
 * @property {number} user.userId - ユーザーID
 * @property {string} user.username - ユーザー名
 * @property {string} [user.image] - ユーザー画像URL（省略可）
 * @property {boolean} liked - ログインユーザーがいいね済みか
 * @property {number} likeCount - いいね数
 * @property {boolean} [justUpdated] - 直近で画像等を更新したフラグ（省略可）
 */
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

/**
 * デバイス（Device）データ型
 *
 * @typedef {Object} Device
 * @property {number} id - デバイスID
 * @property {string} name - デバイス名
 * @property {string} image - デバイス画像URL
 * @property {string} [comment] - デバイスに関するコメント（省略可）
 * @property {number} userId - 所有ユーザーID
 */
export interface Device {
  id: number;
  name: string;
  image: string;
  comment?: string;
  userId: number;
}
