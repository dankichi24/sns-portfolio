import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../lib/authContext";
import { useEffect } from "react";

const Navbar = () => {
  const { user, logout, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ユーザー情報が無い場合、再取得
    if (!user) {
      const fetchUser = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            login(data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }
  }, [user, login]);

  if (isLoading) {
    return null;
  }

  const isMypage = router.pathname === "/mypage";
  const isUserDevicesPage = router.pathname.startsWith("/devices/");

  return (
    <header className="w-full bg-indigo-900 text-white py-4 sticky top-0 z-50">
      <div className="w-full flex justify-between items-center px-12">
        <Link
          href={user ? "/home" : "/"}
          className="text-2xl font-bold hover:opacity-75 transition-opacity duration-300"
        >
          Gaming Device Share
        </Link>
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="flex items-center space-x-2">
                <img
                  src={`http://localhost:5000${
                    user.image || "/uploads/default-profile.png"
                  }`}
                  alt="プロフィール画像"
                  className="w-8 h-8 rounded-full border-2 border-white bg-white"
                />
                <span className="text-sm font-semibold">
                  {user.username}さん
                </span>
              </span>
              <Link
                href={isMypage || isUserDevicesPage ? "/home" : "/mypage"}
                className="bg-white text-indigo-900 px-4 py-2 rounded font-bold hover:bg-gray-200 transition duration-300"
              >
                {isMypage || isUserDevicesPage ? "HOME" : "マイページ"}
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
