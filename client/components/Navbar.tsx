import Link from "next/link";
import { useRouter } from "next/router"; // useRouter をインポート
import { useAuth } from "../lib/authContext";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth(); // isLoading も追加
  const router = useRouter(); // 現在のルートを取得

  console.log("User in Navbar:", user); // ここでログを確認

  if (isLoading) {
    return null; // ローディング中は表示しない（必要に応じてスピナーなどに変更可）
  }

  const isMypage = router.pathname === "/mypage"; // 現在のページが "/mypage" かどうかを判定

  return (
    <header className="w-full bg-indigo-900 text-white py-4 sticky top-0 z-50">
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
                href={isMypage ? "/home" : "/mypage"} // 条件によってボタンのリンクを切り替え
                className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
              >
                {isMypage ? "HOME" : "マイページ"}{" "}
                {/* ボタンのテキストを切り替え */}
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
