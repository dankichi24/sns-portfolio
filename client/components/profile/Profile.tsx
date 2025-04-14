"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/authContext";
import DeviceList from "@/components/profile/DeviceList";
import ImageWithCacheBusting from "@/components/ImageWithCacheBusting";

interface ProfileProps {
  username: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const saveUsername = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!user || !token) throw new Error("ユーザー情報がありません");

      const response = await fetch(`${API_URL}/api/users/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.userId,
          newUsername: editedUsername,
        }),
      });

      if (!response.ok) throw new Error("ユーザー名の更新に失敗しました");

      const data = await response.json();
      login(data.user);

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      alert("エラーが発生しました。");
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("画像を選択してください。");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    formData.append("userId", String(user?.userId));

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/api/users/upload-profile-image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("アップロード失敗");

      const data = await response.json();
      login(data.user);

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      alert("画像アップロード中にエラーが発生しました。");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
        プロフィール
      </h1>
      <div className="flex flex-col items-center">
        <ImageWithCacheBusting
          src={
            previewUrl
              ? previewUrl
              : user?.image
              ? user.image
              : process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_IMAGE || ""
          }
          alt="プロフィール画像"
          className="w-40 h-40 rounded-full object-cover mb-4"
          cacheBust={!!previewUrl}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSelectedImage(file);
            if (file) {
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
          className="mt-2 text-sm"
        />
        <button
          onClick={handleImageUpload}
          className="bg-indigo-600 text-white px-4 py-1 rounded mt-4 text-sm font-medium"
          disabled={isUploading}
        >
          {isUploading ? "アップロード中..." : "画像をアップロード"}
        </button>

        <div className="text-lg font-semibold text-black mt-8">
          {isEditing ? (
            <div className="flex flex-col items-center space-y-3">
              <input
                type="text"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                className="border rounded-md px-4 py-2 w-48 text-center text-lg font-semibold"
                placeholder="新しいユーザー名を入力"
              />
              <div className="flex space-x-3">
                <button
                  onClick={saveUsername}
                  className="bg-indigo-500 text-white px-5 py-2 rounded-md text-base font-semibold"
                >
                  保存
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 underline text-base font-semibold"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-black mb-2">
                {editedUsername}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 underline text-base font-medium"
              >
                名前を編集
              </button>
            </div>
          )}
        </div>

        <hr className="border-t border-gray-300 w-full my-8" />

        <DeviceList />
      </div>
    </div>
  );
};

export default Profile;
