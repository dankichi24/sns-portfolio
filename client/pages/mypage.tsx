import React, { useState } from "react";
import { useAuth } from "../lib/authContext";
import { useRouter } from "next/router";
import ShareHistory from "../components/ShareHistory";

const MyPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md mt-6">
        <div className="flex justify-center space-x-8 border-b pb-4">
          <button
            className={`text-lg font-bold ${
              activeTab === "profile"
                ? "text-indigo-900 border-b-2 border-indigo-900"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            プロフィール
          </button>
          <button
            className={`text-lg font-bold ${
              activeTab === "history"
                ? "text-indigo-900 border-b-2 border-indigo-900"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Share履歴
          </button>
          <button
            className={`text-lg font-bold ${
              activeTab === "favorites"
                ? "text-indigo-900 border-b-2 border-indigo-900"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            お気に入り
          </button>
        </div>
        <div className="mt-6">
          {activeTab === "profile" && (
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900 mb-4">
                プロフィール
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-12 h-12 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5c1.988 0 3.75 1.56 3.75 3.5s-1.762 3.5-3.75 3.5-3.75-1.56-3.75-3.5 1.762-3.5 3.75-3.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14c-3.315 0-6 2.805-6 6.25v.5h12v-.5c0-3.445-2.685-6.25-6-6.25z"
                    />
                  </svg>
                </div>
                <div className="mt-4 text-lg font-semibold">
                  {user.username || "ユーザー名"}
                </div>
                <div className="text-gray-600">{user.email}</div>
              </div>
            </div>
          )}
          {activeTab === "history" && (
            <ShareHistory
              userId={user.userId}
              active={activeTab === "history"}
            />
          )}
          {activeTab === "favorites" && (
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900 mb-4">
                お気に入り
              </div>
              <p>ここにお気に入りが表示されます。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
