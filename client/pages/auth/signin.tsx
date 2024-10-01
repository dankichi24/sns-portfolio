import { useState } from "react";
import apiClient from "../../lib/apiClient";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface ApiErrorResponse {
  error: string;
}

interface ApiSuccessResponse {
  message: string;
  token: string;
}

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ

    try {
      // API にリクエストを送信
      const response = await apiClient.post<ApiSuccessResponse>("/auth/login", {
        email,
        password,
      });

      setSuccess(response.data.message); // 成功メッセージを設定
      setError(null); // エラーメッセージをクリア

      // ログインに成功したらホーム画面にリダイレクト
      router.push("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiErrorResponse;
        setError(apiError.error); // サーバーからのエラーメッセージを設定
      } else {
        setError("ログインに失敗しました。再度お試しください。");
      }

      setSuccess(null);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-12 md:p-16 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">ログイン</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 入力されたメールアドレスを state にセット
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
              onChange={(e) => setPassword(e.target.value)} // 入力されたパスワードを state にセット
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-300"
          >
            ログイン
          </button>
        </form>

        <div className="mt-6 flex justify-between">
          <Link href="/reset-password">
            <button className="py-2 px-4 font-semibold text-gray-700 rounded hover:bg-gray-200 transition duration-300">
              パスワードリセット
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="py-2 px-4 font-semibold text-gray-700 rounded hover:bg-gray-200 transition duration-300">
              新規登録はこちら
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
