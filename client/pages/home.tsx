import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "../lib/apiClient"; // APIクライアントのインポート

// 投稿データの型定義にユーザー名を追加
interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  user: {
    id: number;
    username: string; // ユーザー名を表示するために追加
  };
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
    <div className="home-page">
      <h1 className="text-center text-3xl font-bold mb-4">ホーム画面</h1>
      <div className="flex justify-end mb-4">
        <Link href="/post/create">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Share
          </button>
        </Link>
      </div>

      <div className="post-list">
        <ul>
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.id} className="bg-white p-4 mb-4 rounded shadow-md">
                <div>
                  <strong>{post.user.username}</strong> {/* ユーザー名を表示 */}
                </div>
                <div>{post.title}</div>
                <div>{post.content}</div>
                {post.image && (
                  <img
                    src={`http://localhost:5000${post.image}`} // post.imageが /uploads/ を含むように修正
                    alt={post.title}
                    className="max-w-full h-auto rounded"
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
  );
};

export default Home;
