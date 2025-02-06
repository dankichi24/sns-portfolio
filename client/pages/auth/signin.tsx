import { useState } from "react";
import apiClient from "../../lib/apiClient";
import axios from "axios";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "../../lib/authContext"; // AuthContext から useAuth をインポート

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
const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const { login } = useAuth(); // AuthContext の login 関数を取得

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // デフォルトのフォーム送信を防ぐ

    console.log("Submitting form..."); // フォームが送信されたことを確認

    try {
      // API にリクエストを送信
      console.log("Sending API request..."); // APIリクエストの直前にログを追加

      const response = await apiClient.post<ApiSuccessResponse>(
        "/api/auth/login",
        { email, password }
      );

      console.log("API Response:", response.data); // APIのレスポンス全体を確認
      // 他のログも含めて、全てのデータが正しいか確認
      console.log("Token:", response.data.token);
      console.log("User:", response.data.user);

      setSuccess(response.data.message);
      setError(null);

      const token = response.data.token;
      localStorage.setItem("authToken", token);

      // AuthContext の login 関数に渡すデータをログで確認
      console.log("User data in login:", response.data.user);
      login(response.data.user);

      router.push("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err) && err.response) {
        const apiError = err.response.data as ApiErrorResponse;
        console.log("API error response:", apiError);
        setError(apiError.error);
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

        <div className="mt-6 flex justify-center">
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
