"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import DeviceList from "@/components/profile/DeviceList";
import ImageWithCacheBusting from "@/components/ImageWithCacheBusting";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * プロフィール画面のクライアントコンポーネント
 *
 * @component
 * @returns {JSX.Element} プロフィール画面UI
 * @description
 * ログインユーザーのプロフィール画像・ユーザー名の表示／編集・画像アップロードができる画面。
 * 画像のプレビューやアップロード、ユーザー名編集のバリデーション、下部にはDeviceList（デバイス一覧）も表示。
 */
const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user?.username) {
      setEditedUsername(user.username);
    }
  }, [user?.username]);

  const saveUsername = async () => {
    if (editedUsername.length > 20) {
      setErrorMessage("ユーザー名は20文字以内で入力してください。");
      return;
    }

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
      setIsEditing(false);
      setErrorMessage(null);
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
      setPreviewUrl(data.user.image);
      setSelectedImage(null);
    } catch {
      alert("画像アップロード中にエラーが発生しました。");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          ref={fileInputRef}
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
                onChange={(e) => {
                  setEditedUsername(e.target.value);
                  if (e.target.value.length <= 20) {
                    setErrorMessage(null);
                  }
                }}
                className="border rounded-md px-4 py-2 w-48 text-center text-2xl font-semibold"
                placeholder="新しいユーザー名を入力"
              />

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={saveUsername}
                  className="bg-indigo-500 text-white px-5 py-2 rounded-md text-base font-semibold"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setErrorMessage(null);
                  }}
                  className="text-gray-500 underline text-base font-semibold"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-black mb-2">
                {user?.username}
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
