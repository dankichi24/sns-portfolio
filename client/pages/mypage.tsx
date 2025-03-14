import { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/router";
import ShareHistory from "../components/ShareHistory";
import ShareFavorites from "../components/ShareFavorites";
import Profile from "../components/Profile";

const MyPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (router.query.activeTab) {
      setActiveTab(router.query.activeTab as string);
    }
  }, [router.query.activeTab]);

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md mt-6">
        {/* タブナビゲーション */}
        <div className="flex justify-center space-x-8 border-b pb-4">
          {["profile", "history", "favorites"].map((tab) => (
            <button
              key={tab}
              className={`text-lg font-bold ${
                activeTab === tab
                  ? "text-indigo-900 border-b-2 border-indigo-900"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "profile"
                ? "プロフィール"
                : tab === "history"
                ? "Share履歴"
                : "お気に入り"}
            </button>
          ))}
        </div>

        {/* コンテンツ切り替え */}
        <div className="mt-6">
          {activeTab === "profile" && <Profile username={user.username} />}
          {activeTab === "history" && (
            <ShareHistory userId={user.userId} active />
          )}
          {activeTab === "favorites" && (
            <ShareFavorites userId={user.userId} active />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
