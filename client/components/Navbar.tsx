import Link from "next/link";
import { useAuth } from "../lib/authContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // ログイン状態とログアウト関数を取得

  return (
    <header className="w-full bg-indigo-900 text-white py-4">
      <div className="w-full flex justify-between items-center px-12">
        <Link
          href="/"
          className="text-2xl font-bold hover:opacity-75 transition-opacity duration-300"
        >
          Gaming Device Share
        </Link>
        <div className="flex space-x-3">
          {user ? (
            <>
              <span>{user.name}</span> {/* ログイン中のユーザー名を表示 */}
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
