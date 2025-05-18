"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

interface ApiErrorResponse {
  error: string;
}

interface ApiSuccessResponse {
  message: string;
  token: string;
  user: {
    userId: number;
    username: string;
    email: string;
  };
}

/**
 * サインアップ（新規登録）画面のクライアントコンポーネント
 *
 * @component
 * @returns {JSX.Element} サインアップフォームのUI
 * @description
 * ユーザー名・メールアドレス・パスワードを入力し、サインアップAPIにPOSTする。
 * パスワードの一致チェック・入力補助（表示切替）・エラーハンドリングに対応。
 * 登録成功時は自動的にログインし、ホーム画面へ遷移。
 */
const SignUpClient = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      const response = await apiClient.post<ApiSuccessResponse>(
        "/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      setSuccess(response.data.message);
      setError(null);

      localStorage.setItem("authToken", response.data.token);
      login(response.data.user);
      router.push("/home");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError((err.response.data as ApiErrorResponse).error);
      } else {
        setError("登録に失敗しました。再度お試しください。");
      }

      setSuccess(null);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-12 md:p-16 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">新規登録</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ユーザー名"
              className="w-full px-4 py-3 border rounded"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              className="w-full px-4 py-3 border rounded"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">パスワード</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="w-full px-4 py-3 border rounded"
              required
            />
            <span
              className="absolute right-4 top-11 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </div>

          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">パスワード確認</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワード確認"
              className="w-full px-4 py-3 border rounded"
              required
            />
            <span
              className="absolute right-4 top-11 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
              />
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-300"
          >
            新規登録
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/signin">
            <button className="py-2 px-4 font-semibold text-gray-700 rounded hover:bg-gray-200 transition duration-300">
              ログインはこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpClient;
