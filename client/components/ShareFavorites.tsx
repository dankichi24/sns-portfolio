import React, { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import PostItem from "../components/PostItem";
import { Post } from "../types";

interface ShareFavoritesProps {
  userId: number;
  active: boolean;
}

const ShareFavorites: React.FC<ShareFavoritesProps> = ({ userId, active }) => {
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [animateLike, setAnimateLike] = useState<number | null>(null); // アニメーション管理

  useEffect(() => {
    if (!active) return;

    const fetchFavoritePosts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/posts/favorites");
        setFavoritePosts(response.data);
      } catch (error) {
        console.error("Error fetching favorite posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, [active]);

  // 「いいね」を解除して投稿を削除
  const handleUnlike = async (postId: number) => {
    try {
      // アニメーションのためlikedを一時的にfalseにする
      setFavoritePosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, liked: false } : post
        )
      );

      setAnimateLike(postId); // アニメーションを開始

      // API呼び出し（いいね解除）
      await apiClient.post("/api/posts/like", { postId });

      // アニメーション後に投稿を削除
      setTimeout(() => {
        setFavoritePosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        setAnimateLike(null); // アニメーション状態をリセット
      }, 300); // アニメーション時間に合わせる
    } catch (error) {
      console.error("Error unliking the post:", error);
      setAnimateLike(null); // エラーが発生した場合はアニメーションをリセット
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
        お気に入り
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Now Loading...</p>
      ) : favoritePosts.length === 0 ? (
        <p className="text-center text-gray-600">
          お気に入りの投稿がありません。
        </p>
      ) : (
        <div className="post-list space-y-6">
          {favoritePosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userId={userId}
              toggleLike={() => handleUnlike(post.id)} // いいね解除時
              confirmDeletePost={() => {}}
              openModal={() => {}}
              animateLike={animateLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareFavorites;
