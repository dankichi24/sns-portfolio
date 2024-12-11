import React, { useEffect, useState } from "react";
import apiClient from "../lib/apiClient";
import PostItem from "../components/PostItem";
import { Post } from "../types";

interface ShareHistoryProps {
  userId: number;
  active: boolean;
}

const ShareHistory: React.FC<ShareHistoryProps> = ({ userId, active }) => {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active) return;

    const fetchMyPosts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/posts/my-posts");
        setMyPosts(response.data);
      } catch (error) {
        console.error("Error fetching my posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [active]);

  return (
    <div>
      {/* 見出しを追加 */}
      <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
        Share履歴
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Now Loading...</p>
      ) : myPosts.length === 0 ? (
        <p className="text-center text-gray-600">まだ投稿がありません。</p>
      ) : (
        <div className="post-list space-y-6">
          <ul className="space-y-6">
            {myPosts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                userId={userId}
                toggleLike={() => {}}
                confirmDeletePost={() => {}}
                openModal={() => {}}
                animateLike={null}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShareHistory;
