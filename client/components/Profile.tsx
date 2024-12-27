import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import apiClient from "../lib/apiClient";

interface ProfileProps {
  username: string;
}

interface Post {
  id: number;
  content: string;
  userId: number;
}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const { user, login } = useAuth(); // AuthContext から login を取得
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [myPosts, setMyPosts] = useState<Post[]>([]); // 投稿データを状態に保持

  // ユーザー名の更新処理
  const updateUsername = async (newUsername: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!user) {
        throw new Error("ユーザー情報が取得できませんでした。");
      }

      const response = await fetch(
        "http://localhost:5000/api/users/update-username",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            newUsername,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ユーザー名の更新に失敗しました。");
      }

      const data = await response.json();
      return data.user; // 更新されたユーザー情報を返す
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
      return null;
    }
  };

  // 投稿データの取得
  const fetchMyPosts = async () => {
    try {
      const response = await apiClient.get("/api/posts/my-posts");
      console.log("取得した投稿:", response.data); // デバッグ用
      setMyPosts(response.data); // 投稿データを状態に設定
    } catch (error) {
      console.error("投稿データの取得に失敗しました:", error);
    }
  };

  // ユーザー名保存処理
  const saveUsername = async () => {
    try {
      const updatedUser = await updateUsername(editedUsername);
      if (updatedUser) {
        login(updatedUser); // ユーザー情報をグローバル状態に反映
        window.location.reload(); // ページをリロード
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("エラーが発生しました。");
    }
  };

  // 初期ロード時に投稿データを取得
  useEffect(() => {
    if (user) {
      console.log("現在のユーザー:", user);
      fetchMyPosts(); // ユーザー情報更新時に投稿データを取得
    }
  }, [user]);

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-2xl font-bold text-indigo-900 mb-4">
          プロフィール
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-indigo-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4.41 0-8 1.79-8 4v1h16v-1c0-2.21-3.59-4-8-4z"
              />
            </svg>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="border rounded-md px-2 py-1 text-center w-40"
                />
                <button
                  onClick={saveUsername}
                  className="bg-indigo-500 text-white px-2 py-1 rounded-md"
                >
                  保存
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 underline"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>{username}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-500 underline"
                >
                  編集
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 投稿一覧 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">投稿一覧</h2>
        <ul>
          {myPosts.map((post: Post) => (
            <li key={post.id} className="text-lg font-bold mb-2">
              {post.content}
              {post.userId === user?.userId && (
                <>
                  <button className="ml-4 text-red-500">削除</button>
                  <button className="ml-2 text-blue-500">編集</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
