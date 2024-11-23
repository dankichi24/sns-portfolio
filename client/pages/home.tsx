import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEdit } from "react-icons/fi"; // アイコンをインポート
import { FaTrashAlt } from "react-icons/fa"; // 削除アイコンもインポート
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiClient from "../lib/apiClient";
import { useAuth } from "../lib/authContext"; // 認証コンテキストをインポート

// SweetAlert2をReactと統合
const MySwal = withReactContent(Swal);

// 投稿データの型定義
interface Post {
  id: number;
  content: string;
  image?: string;
  user: {
    userId: number; // userId として定義
    username: string; // ユーザー名を表示
  };
  createdAt: string; // 投稿日時を追加
  liked: boolean; // いいねの状態を追跡
  likeCount: number; // いいね数を表示
}

const Home = () => {
  const { user, isLoading } = useAuth();
  const userId = !isLoading && user ? user.userId : null; // 修正ポイント
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示・非表示の状態
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 選択された画像のURL
  const [animateLike, setAnimateLike] = useState<number | null>(null); // クリックエフェクト用

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get("/api/posts");
      const modifiedData = response.data.map((post: Post) => ({
        ...post,
        user: {
          userId: post.user.userId, // APIの`user.id`を`user.userId`に変換
          username: post.user.username,
        },
      }));
      setPosts(modifiedData);
    } catch (error) {
      console.error("Error fetching posts:", error);
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
              likeCount: response.data.likeCount, // サーバーから返された最新のlikeCountを使用
            }
          : post
      );
      setPosts(updatedPosts);

      // いいねアニメーションをトリガー
      setAnimateLike(postId);
      setTimeout(() => setAnimateLike(null), 300); // アニメーション後にリセット
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
    document.body.style.overflow = "hidden"; // モーダルを開いたら背景のスクロールを無効に
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // モーダルを閉じたら背景のスクロールを有効に
  };

  // 編集機能の関数
  const editPost = async (postId: number, newContent: string) => {
    try {
      const response = await apiClient.put(`/api/posts/${postId}`, {
        content: newContent,
      });
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, content: response.data.post.content }
            : post
        )
      );
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  // 削除機能の関数（SweetAlert2を使用）
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
      reverseButtons: true, // ボタンの順序を逆にする
    }).then((result) => {
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

        {/* タイムライン風の投稿リスト */}
        <div className="post-list">
          <ul className="space-y-6 max-w-4xl mx-auto">
            {posts.length > 0 ? (
              posts.map((post) => {
                // ログを追加して確認する
                console.log("Current userId:", userId);
                console.log("Post userId:", post.user.userId);

                return (
                  <li
                    key={post.id}
                    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-blue-600">
                        {post.user.username}
                      </span>
                      <div className="flex items-center">
                        {post.user.userId === userId && (
                          <>
                            <button
                              onClick={() => {
                                const newContent = prompt(
                                  "新しい内容を入力してください",
                                  post.content
                                );
                                if (newContent) {
                                  editPost(post.id, newContent);
                                }
                              }}
                              className="flex items-center text-base text-blue-500 hover:text-blue-700 mr-4 focus:outline-none"
                            >
                              <FiEdit className="mr-1" size={17} />
                            </button>
                            <button
                              onClick={() => confirmDeletePost(post.id)}
                              className="flex items-center text-base text-red-500 hover:text-red-700 mr-4 focus:outline-none"
                            >
                              <FaTrashAlt className="mr-1" size={17} />
                            </button>
                          </>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-700 mb-4 leading-relaxed">
                      {post.content}
                    </div>
                    {post.image && (
                      <img
                        src={`http://localhost:5000${post.image}`}
                        alt="Post image"
                        className="max-w-full h-auto mx-auto rounded-md shadow-sm cursor-pointer"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                        onClick={() =>
                          openModal(`http://localhost:5000${post.image}`)
                        }
                      />
                    )}

                    {/* いいねボタンとカウント */}
                    <div className="flex justify-end items-center mt-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`mr-2 text-xl ${
                          post.liked ? "text-yellow-500" : "text-gray-500"
                        } ${animateLike === post.id ? "animate-pop" : ""}`}
                        style={{
                          textShadow: post.liked
                            ? "0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 4px rgba(0, 0, 0, 0.3)"
                            : "0px 0px 4px rgba(0, 0, 0, 0.3)",
                        }}
                      >
                        {post.liked ? "★" : "☆"}
                      </button>
                      <span className="text-gray-600 text-lg">
                        {post.likeCount} nice!
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <li>投稿がありません。</li>
            )}
          </ul>
        </div>

        {/* モーダルの実装 */}
        {isModalOpen && selectedImage && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-lg max-w-screen-lg max-h-screen overflow-auto">
              {/* 画像の最大幅と高さを制限 */}
              <img
                src={selectedImage}
                alt="Large view"
                className="max-w-full max-h-screen mx-auto"
                style={{ objectFit: "contain" }} // 画像を収めるためのスタイル
              />
              <button
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
