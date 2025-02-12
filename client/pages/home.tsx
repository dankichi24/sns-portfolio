import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiClient from "../lib/apiClient";
import { useAuth } from "../lib/authContext";
import { Post } from "../types";
import PostItem from "../components/PostItem";
import Modal from "../components/Modal";

const MySwal = withReactContent(Swal);

const Home = () => {
  const { user, isLoading } = useAuth();
  const userId = !isLoading && user ? user.userId : null;

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [animateLike, setAnimateLike] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/api/posts");
        setPosts(
          response.data.map((post: Post) => ({
            ...post,
            user: {
              userId: post.user.userId,
              username: post.user.username,
              image: post.user.image || "/uploads/default-profile.png",
            },
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = async (postId: number) => {
    try {
      const response = await apiClient.post("/api/posts/like", { postId });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: response.data.liked,
                likeCount: response.data.likeCount,
              }
            : post
        )
      );

      setAnimateLike(postId);
      setTimeout(() => setAnimateLike(null), 300);
    } catch {}
  };

  const confirmDeletePost = (postId: number) => {
    document.body.style.overflow = "hidden";

    MySwal.fire({
      title: "削除してもよろしいですか？",
      text: "この操作は元に戻せません。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "削除",
      cancelButtonText: "キャンセル",
      reverseButtons: true,
    }).then((result) => {
      document.body.style.overflow = "auto";

      if (result.isConfirmed) {
        deletePost(postId);
      }
    });
  };

  const deletePost = async (postId: number) => {
    try {
      await apiClient.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch {}
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="home-page max-w-4xl mx-auto p-4">
        <h1 className="text-center text-4xl font-bold mb-6 text-gray-800">
          <span className="border-b-4 border-blue-500 pb-2">Share List</span>
        </h1>

        <div className="flex justify-end mb-8">
          <Link href="/post/create">
            <button className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300 shadow-md">
              投稿
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-500">Now Loading...</p>
        ) : (
          <div className="post-list">
            <ul className="space-y-6 max-w-4xl mx-auto">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    userId={userId}
                    toggleLike={toggleLike}
                    confirmDeletePost={confirmDeletePost}
                    openModal={openModal}
                    animateLike={animateLike}
                    activeTab="home"
                  />
                ))
              ) : (
                <li>投稿がありません。</li>
              )}
            </ul>
          </div>
        )}

        <Modal
          isModalOpen={isModalOpen}
          selectedImage={selectedImage}
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default Home;
