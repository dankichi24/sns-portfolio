import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiClient from "../lib/apiClient";
import { useAuth } from "../lib/authContext";
import { Post } from "../types";
import PostItem from "../components/PostItem";
import Modal from "../components/Modal";

// SweetAlert2をReactと統合
const MySwal = withReactContent(Swal);

const Home = () => {
  const { user, isLoading } = useAuth();
  const userId = !isLoading && user ? user.userId : null;

  // ローディング状態のstateを追加
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [animateLike, setAnimateLike] = useState<number | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true); // データ取得開始前にローディングをtrueにする
      const response = await apiClient.get("/api/posts");
      const modifiedData = response.data.map((post: Post) => ({
        ...post,
        user: {
          userId: post.user.userId,
          username: post.user.username,
        },
      }));
      setPosts(modifiedData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // データ取得完了後にローディングをfalseにする
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      const response = await apiClient.post("/api/posts/like", { postId });
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: response.data.liked,
              likeCount: response.data.likeCount,
            }
          : post
      );
      setPosts(updatedPosts);

      // いいねアニメーションをトリガー
      setAnimateLike(postId);
      setTimeout(() => setAnimateLike(null), 300);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // モーダルを開く関数
  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  // 削除確認の関数（SweetAlert2を使用）
  const confirmDeletePost = (postId: number) => {
    // モーダルを開くときにスクロールを無効に
    document.body.style.overflow = "hidden";

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
      // モーダルを閉じたときにスクロールを再開
      document.body.style.overflow = "auto";

      if (result.isConfirmed) {
        deletePost(postId);
      }
    });
  };

  // 削除機能の関数
  const deletePost = async (postId: number) => {
    try {
      await apiClient.delete(`/api/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ページ全体に背景を適用 */}
      <div className="home-page max-w-4xl mx-auto p-4">
        <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
          <span className="border-b-4 border-blue-500 pb-2">Share List</span>
        </h1>

        {/* 投稿ボタン */}
        <div className="flex justify-end mb-8">
          <Link href="/post/create">
            <button className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300 shadow-md">
              Shareする
            </button>
          </Link>
        </div>

        {/* ローディング状態の表示 */}
        {loading ? (
          <p className="text-center text-lg text-gray-500">Now Loading...</p>
        ) : (
          /* タイムライン風の投稿リスト */
          <div className="post-list">
            <ul className="space-y-6 max-w-4xl mx-auto">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    userId={userId}
                    toggleLike={toggleLike}
                    confirmDeletePost={confirmDeletePost}
                    openModal={openModal}
                    animateLike={animateLike}
                  />
                ))
              ) : (
                <li>投稿がありません。</li>
              )}
            </ul>
          </div>
        )}

        {/* モーダルの実装 */}
        <Modal
          isModalOpen={isModalOpen}
          selectedImage={selectedImage}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default Home;
