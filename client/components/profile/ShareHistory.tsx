"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import PostItem from "@/components/post/PostItem";
import Modal from "@/components/ui/Modal";
import { Post } from "@/types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ShareHistoryProps {
  userId: number;
  active: boolean;
}

/**
 * 投稿履歴（自分の投稿一覧）画面のクライアントコンポーネント
 *
 * @component
 * @param {Object} props
 * @param {number} props.userId - 対象ユーザーのID
 * @param {boolean} props.active - タブがアクティブかどうか
 * @returns {JSX.Element} 投稿履歴リストUI
 * @description
 * ログインユーザーの過去の投稿をAPIから取得し一覧を表示。
 * 投稿のいいね・削除・画像モーダル表示、ローディングやエラーハンドリングなどの機能を備えています。
 */
const ShareHistory: React.FC<ShareHistoryProps> = ({ userId, active }) => {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
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

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/posts/my-posts");
      setMyPosts(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active) {
      fetchMyPosts();
    }
  }, [active, userId]);

  const toggleLike = async (postId: number) => {
    const prevPosts = [...myPosts];

    setMyPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likeCount: post.liked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );

    setAnimateLike(postId);
    setTimeout(() => setAnimateLike(null), 300);

    try {
      await apiClient.post("/api/posts/like", { postId });
    } catch {
      setMyPosts(prevPosts);
      MySwal.fire("エラー", "いいねの処理に失敗しました。", "error");
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
      setMyPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch {
      MySwal.fire("エラー", "削除中に問題が発生しました。", "error");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
        Share履歴
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Now Loading...</p>
      ) : myPosts.length === 0 ? (
        <p className="text-center text-gray-600">まだ投稿がありません。</p>
      ) : (
        <div className="post-list space-y-6">
          {myPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              userId={userId}
              confirmDeletePost={() => confirmDeletePost(post.id)}
              toggleLike={() => toggleLike(post.id)}
              openModal={() =>
                post.image &&
                openModal(
                  post.justUpdated
                    ? `${post.image}?v=${Date.now()}`
                    : post.image
                )
              }
              animateLike={animateLike}
              activeTab="history"
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

export default ShareHistory;
