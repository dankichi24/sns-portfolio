import React, { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import PostItem from "../components/PostItem";
import { Post } from "../types";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ShareHistoryProps {
  userId: number;
  active: boolean;
}

const ShareHistory: React.FC<ShareHistoryProps> = ({ userId, active }) => {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [animateLike, setAnimateLike] = useState<number | null>(null);

  // 投稿データを取得する関数
  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/posts/my-posts");
      setMyPosts(response.data);
    } finally {
      setLoading(false);
    }
  };

  // データ取得を行う useEffect
  useEffect(() => {
    if (active) {
      fetchMyPosts();
    }
  }, [active, userId]);

  // いいねのトグル処理
  const toggleLike = async (postId: number) => {
    try {
      setAnimateLike(postId);

      const response = await apiClient.post("/api/posts/like", { postId });
      setMyPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: response.data.liked,
                likeCount: response.data.likeCount,
              }
            : post
        )
      );

      setTimeout(() => setAnimateLike(null), 300);
    } catch {
      setAnimateLike(null);
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
              openModal={() => {}}
              animateLike={animateLike}
              activeTab="history"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareHistory;
