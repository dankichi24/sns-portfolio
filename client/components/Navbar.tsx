import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../lib/authContext";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Navbar = () => {
  const { user, logout, login, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
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
          if (process.env.NODE_ENV !== "production") {
            console.error("Error fetching user:", error);
          }
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
      <div className="w-full flex justify-between items-center px-4 sm:px-12">
        <Link
          href={user ? "/home" : "/"}
          className="text-lg sm:text-2xl font-bold hover:opacity-75 transition-opacity duration-300"
        >
          Gaming Device Share
        </Link>

        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <>
              <span className="flex items-center space-x-2">
                <img
                  src={
                    user?.image
                      ? `${user.image}?t=${Date.now()}`
                      : `${
                          process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_IMAGE
                        }?t=${Date.now()}`
                  }
                  alt="プロフィール画像"
                  className="w-8 h-8 rounded-full object-cover bg-indigo-900"
                />
                <span className="text-sm font-semibold">
                  {user.username}さん
                </span>
              </span>
              <Link
                href={isMypage || isUserDevicesPage ? "/home" : "/mypage"}
                className="bg-white text-indigo-900 px-3 py-1 sm:px-4 sm:py-2 rounded font-bold hover:bg-gray-200 transition"
              >
                {isMypage || isUserDevicesPage ? "HOME" : "マイページ"}
              </Link>
              <button
                onClick={logout}
                className="bg-white text-indigo-900 px-3 py-1 sm:px-4 sm:py-2 rounded font-bold hover:bg-gray-200 transition"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="bg-white text-indigo-900 px-3 py-1 sm:px-4 sm:py-2 rounded font-bold hover:bg-gray-200 transition"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white text-indigo-900 px-3 py-1 sm:px-4 sm:py-2 rounded font-bold hover:bg-gray-200 transition"
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
