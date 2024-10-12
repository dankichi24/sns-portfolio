import React from "react";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/router";

const MyPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  // 未ログインユーザーがアクセスした場合のリダイレクト処理
  if (!user) {
    router.push("/auth/signin");
    return null; // リダイレクト中は何も表示しない
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">マイページ</h1>
      <p>ユーザー名: {user.username}</p>
      <p>メールアドレス: {user.email}</p>
      {/* 他のユーザー情報や機能を追加 */}
    </div>
  );
};

export default MyPage;
