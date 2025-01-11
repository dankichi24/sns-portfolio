import React, { useState } from "react";
import { useAuth } from "../lib/authContext";

interface ProfileProps {
  username: string;
}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const saveUsername = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!user) throw new Error("ユーザー情報が取得できませんでした。");

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
            newUsername: editedUsername,
          }),
        }
      );

      if (!response.ok) throw new Error("ユーザー名の更新に失敗しました。");

      const data = await response.json();
      login(data.user); // 状態を直接更新
      alert("ユーザー名が更新されました！");
      window.location.reload(); // ページを強制リロード
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("画像を選択してください。");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    formData.append("userId", String(user?.userId));

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/users/upload-profile-image",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("画像アップロードに失敗しました。");

      const data = await response.json();
      login(data.user); // 状態を直接更新
      alert("プロフィール画像が更新されました！");
      window.location.reload(); // ページを強制リロード
    } catch (error) {
      console.error("画像アップロードエラー:", error);
      alert("画像アップロード中にエラーが発生しました。");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-indigo-900 mb-4">プロフィール</h1>
      <div className="flex flex-col items-center">
        <img
          src={
            user?.image
              ? `http://localhost:5000${user.image}?t=${Date.now()}`
              : `http://localhost:5000/uploads/default-profile.png`
          }
          alt="プロフィール画像"
          className="w-40 h-40 rounded-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          className="mt-4"
        />
        <button
          onClick={handleImageUpload}
          className="bg-indigo-500 text-white px-4 py-2 rounded mt-4"
        >
          画像をアップロード
        </button>
        <div className="text-lg font-semibold text-gray-700 mt-4">
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
              <span>{editedUsername}</span>
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
  );
};

export default Profile;
