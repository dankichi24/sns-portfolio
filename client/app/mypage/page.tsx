"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import ShareHistory from "@/components/profile/ShareHistory";
import ShareFavorites from "@/components/profile/ShareFavorites";
import Profile from "@/components/profile/Profile";

const MyPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tab = searchParams.get("activeTab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md mt-6">
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
