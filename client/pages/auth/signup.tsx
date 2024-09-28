import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const SignUp = () => {
  // パスワードとパスワード確認の表示切り替え
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-12 md:p-16 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">新規登録</h1>

        <form>
          {/* ユーザー名 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">ユーザー名</label>
            <input
              type="text"
              placeholder="ユーザー名"
              className="w-full px-4 py-3 border rounded"
              required
            />
          </div>

          {/* メールアドレス */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">メールアドレス</label>
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full px-4 py-3 border rounded"
              required
            />
          </div>

          {/* パスワード */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">パスワード</label>
            <input
              type={showPassword ? "text" : "password"}
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

          {/* パスワード確認 */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 mb-2">パスワード確認</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
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

          {/* 新規登録ボタン */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition duration-300"
          >
            新規登録
          </button>
        </form>

        {/* ログインリンク */}
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
