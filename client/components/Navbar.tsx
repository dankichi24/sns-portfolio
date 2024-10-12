import Link from "next/link";
import { useAuth } from "../lib/authContext";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth(); // isLoading も追加

  console.log("User in Navbar:", user); // ここでログを確認

  if (isLoading) {
    return null; // ローディング中は表示しない（必要に応じてスピナーなどに変更可）
  }

  return (
    <header className="w-full bg-indigo-900 text-white py-4">
      <div className="w-full flex justify-between items-center px-12">
        <Link
          href={user ? "/home" : "/"} // user が存在する場合 /home に移動、そうでない場合 /
          className="text-2xl font-bold hover:opacity-75 transition-opacity duration-300"
        >
          Gaming Device Share
        </Link>
        <div className="flex space-x-3">
          {user ? (
            <>
              <span>{user.username}さん</span>{" "}
              {/* ログイン中のユーザー名を表示 */}
              <Link
                href="/mypage"
                className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
              >
                マイページ
              </Link>
              <button
                onClick={logout}
                className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
