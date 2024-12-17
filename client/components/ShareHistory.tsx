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
  const [animateLike, setAnimateLike] = useState<number | null>(null); // アニメーション管理

  useEffect(() => {
    if (!active) return;

    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/posts/my-posts");
        setMyPosts(response.data);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [active]);

  // いいねのトグル処理
  const toggleLike = async (postId: number) => {
    try {
      setAnimateLike(postId); // アニメーションを開始

      const response = await apiClient.post("/api/posts/like", { postId });
      setMyPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: response.data.liked, // APIのレスポンスに従って更新
                likeCount: response.data.likeCount,
              }
            : post
        )
      );

      setTimeout(() => setAnimateLike(null), 300); // アニメーション終了
    } catch (error) {
      console.error("Error toggling like:", error);
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
    } catch (error) {
      console.error("Error deleting post:", error);
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
              confirmDeletePost={() => confirmDeletePost(post.id)} // 削除機能
              toggleLike={() => toggleLike(post.id)} // いいねのトグル
              openModal={() => {}}
              animateLike={animateLike} // アニメーション管理
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareHistory;
