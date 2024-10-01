import { useState } from "react";
import apiClient from "../../lib/apiClient"; // 共通の axios インスタンス
import axios from "axios"; // Axiosの基本インポートのみ
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router"; // useRouter をインポート

// 型定義
interface ApiErrorResponse {
  error: string;
}

interface ApiSuccessResponse {
  message: string;
  token: string;
}

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter(); // useRouter フックのインスタンスを作成

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信を防ぐ
    console.log("Submitting form...");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);

    // APIリクエストの前にエラーチェック
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      const response = await apiClient.post<ApiSuccessResponse>(
        "/auth/register",
        {
          username,
          email,
          password,
        }
      );
      console.log("Success response:", response);
      setSuccess(response.data.message);
      setError(null);

      // 成功したらホーム画面にリダイレクト
      router.push("/home"); // ホーム画面にリダイレクトする
    } catch (err) {
      console.error("Error during API request:", err);
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiErrorResponse;
        setError(apiError.error);
      } else {
        setError("登録に失敗しました。再度お試しください。");
      }
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

export default SignUp;
