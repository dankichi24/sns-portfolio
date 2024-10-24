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
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await apiClient.get<Post[]>("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
                  {/* 投稿の内容を表示 */}
                  <div className="text-gray-700 mb-4 leading-relaxed">
                    {post.content}
                  </div>
                  {post.image && (
                    <img
                      src={`http://localhost:5000${post.image}`}
                      alt="Post image"
                      className="max-w-full h-auto mx-auto rounded-md shadow-sm"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                  )}
                </li>
              ))
            ) : (
              <li>投稿がありません。</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
