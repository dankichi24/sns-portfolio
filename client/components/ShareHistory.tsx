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

  if (loading) {
    return <p className="text-center text-gray-600">Now Loading...</p>;
  }

  if (myPosts.length === 0) {
    return <p className="text-center text-gray-600">まだ投稿がありません。</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto p-4">
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
      </div>
    </div>
  );
};

export default ShareHistory;
