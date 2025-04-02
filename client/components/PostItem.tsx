import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { Post } from "../types";
import ImageWithCacheBusting from "./ImageWithCacheBusting";

interface PostItemProps {
  post: Post;
  userId: number | null;
  toggleLike: (postId: number) => void;
  confirmDeletePost: (postId: number) => void;
  openModal: (image: string) => void;
  animateLike: number | null;
  activeTab: string;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  userId,
  toggleLike,
  confirmDeletePost,
  openModal,
  animateLike,
  activeTab = "home",
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
      {/* 投稿者情報 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={
              post.user.image
                ? `${post.user.image}?t=${Date.now()}`
                : `${
                    process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_IMAGE
                  }?t=${Date.now()}`
            }
            alt="User profile"
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
          <Link
            href={`/devices/${post.user.userId}`}
            className="text-xl font-semibold text-blue-600 hover:underline"
          >
            {post.user.username}
          </Link>
        </div>
        <div className="flex items-center">
          {post.user.userId === userId && (
            <>
              <Link
                href={{
                  pathname: `/post/edit`,
                  query: {
                    id: post.id,
                    returnUrl: `${window.location.pathname}?activeTab=${activeTab}`,
                  },
                }}
              >
                <button className="flex items-center text-base text-blue-500 hover:text-blue-700 mr-4 focus:outline-none">
                  <FiEdit className="mr-1" size={17} />
                </button>
              </Link>
              <button
                onClick={() => confirmDeletePost(post.id)}
                className="flex items-center text-base text-red-500 hover:text-red-700 mr-4 focus:outline-none"
              >
                <FaTrashAlt className="mr-1" size={17} />
              </button>
            </>
          )}
          <span className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 本文を名前の下に移動し、間隔を調整 + 改行を適用 */}
      <div className="text-gray-700 mt-5 mb-4 leading-relaxed whitespace-pre-wrap pl-10">
        {post.content}
      </div>
      {/* 画像の表示 */}
      {post.image && (
        <ImageWithCacheBusting
          src={post.image}
          alt="Post image"
          className="max-w-full h-auto mx-auto rounded-md shadow-sm cursor-pointer mt-4"
          style={{ maxHeight: "300px", objectFit: "cover" }}
          cacheBust={!!post.justUpdated} // ← 投稿直後だけ true にする
          onClick={() =>
            post.image &&
            openModal(
              post.justUpdated ? `${post.image}?v=${Date.now()}` : post.image
            )
          }
        />
      )}

      {/* いいねボタンとカウント */}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => toggleLike(post.id)}
          className={`mr-2 text-xl ${
            post.liked ? "text-yellow-500" : "text-gray-500"
          } ${animateLike === post.id ? "animate-pop" : ""}`}
          style={{
            textShadow: post.liked
              ? "0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 4px rgba(0, 0, 0, 0.3)"
              : "0px 0px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          {post.liked ? "★" : "☆"}
        </button>
        <span className="text-gray-600 text-lg">{post.likeCount} nice!</span>
      </div>
    </div>
  );
};

export default PostItem;
