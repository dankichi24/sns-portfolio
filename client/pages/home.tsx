import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "../lib/apiClient";

// 投稿データの型定義
interface Post {
  id: number;
  content: string;
  image?: string;
  user: {
    id: number;
    username: string; // ユーザー名を表示
  };
  createdAt: string; // 投稿日時を追加
  liked: boolean; // いいねの状態を追跡
  likeCount: number; // いいね数を表示
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示・非表示の状態
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 選択された画像のURL
  const [animateLike, setAnimateLike] = useState<number | null>(null); // クリックエフェクト用

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get("/api/posts");
      setPosts(response.data); // サーバーから取得したデータにlikeCountが含まれる
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

  return (
    <div className="bg-gray-100 min-h-screen">
      {" "}
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
              posts.map((post) => (
                <li
                  key={post.id}
                  className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-black">
                      {post.user.username}
                    </span>
                    {/* 投稿作成日を表示 */}
                    <span className="text-sm text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
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
                      } // 画像をクリックしたときにモーダルを開く
                    />
                  )}

                  {/* ここにいいねボタンとカウントを追加 */}
                  <div className="flex justify-end items-center mt-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`mr-2 text-xl ${
                        post.liked ? "text-yellow-500" : "text-gray-500"
                      } ${animateLike === post.id ? "animate-pop" : ""}`}
                    >
                      {post.liked ? "★" : "☆"} {/* いいねアイコン */}
                    </button>
                    <span className="text-gray-600 text-lg">
                      {" "}
                      {/* カウントの文字サイズを大きく */}
                      {post.likeCount} nice!
                    </span>
                  </div>
                </li>
              ))
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
