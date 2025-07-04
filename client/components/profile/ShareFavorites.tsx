"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import PostItem from "@/components/post/PostItem";
import Modal from "@/components/ui/Modal";
import { Post } from "@/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ShareFavoritesProps {
  userId: number;
  active: boolean;
}

/**
 * お気に入り投稿一覧画面のクライアントコンポーネント
 *
 * @component
 * @param {Object} props
 * @param {number} props.userId - 対象ユーザーのID
 * @param {boolean} props.active - タブがアクティブかどうか
 * @returns {JSX.Element} お気に入り投稿リストUI
 * @description
 * ログインユーザーがお気に入りした投稿をAPIから取得し一覧を表示。
 * いいね解除（お気に入り解除）、投稿削除、画像モーダル、ローディング・エラー表示に対応。
 */
const ShareFavorites: React.FC<ShareFavoritesProps> = ({ userId, active }) => {
  const [favoritePosts, setFavoritePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [animateLike, setAnimateLike] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (!active) return;

    const fetchFavoritePosts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/posts/favorites");
        setFavoritePosts(response.data);
      } catch {
        MySwal.fire("エラー", "お気に入りの取得に失敗しました。", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePosts();
  }, [active]);

  const handleUnlike = async (postId: number) => {
    try {
      setFavoritePosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, liked: false } : post
        )
      );

      setAnimateLike(postId);

      await apiClient.post("/api/posts/like", { postId });

      setTimeout(() => {
        setFavoritePosts((prevPosts) =>
          prevPosts.filter((post) => post.id !== postId)
        );
        setAnimateLike(null);
      }, 300);
    } catch {
      setAnimateLike(null);
      MySwal.fire("エラー", "いいねの解除に失敗しました。", "error");
    }
  };

  const confirmDeletePost = (postId: number) => {
    MySwal.fire({
      title: "削除してもよろしいですか？",
      text: "この操作は元に戻せません。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "削除",
      cancelButtonText: "キャンセル",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeletePost(postId);
      }
    });
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await apiClient.delete(`/api/posts/${postId}`);
      setFavoritePosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch {
      MySwal.fire("エラー", "削除中に問題が発生しました。", "error");
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
              toggleLike={() => handleUnlike(post.id)}
              confirmDeletePost={() => confirmDeletePost(post.id)}
              openModal={openModal}
              animateLike={animateLike}
              activeTab="favorites"
            />
          ))}
        </div>
      )}

      <Modal
        isModalOpen={isModalOpen}
        selectedImage={selectedImage}
        closeModal={closeModal}
      />
    </div>
  );
};

export default ShareFavorites;
