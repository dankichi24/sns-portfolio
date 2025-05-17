import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { Post } from "@/types";
import ImageWithCacheBusting from "@/components/ImageWithCacheBusting";

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
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center min-w-0">
          <Link
            href={`/devices/${post.user.userId}`}
            className="flex items-center group min-w-0"
          >
            <ImageWithCacheBusting
              src={
                post.user.image
                  ? post.user.image
                  : process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_IMAGE || ""
              }
              alt="User profile"
              className="w-8 h-8 rounded-full object-cover mr-2 shrink-0"
              cacheBust={false}
            />
            <span
              className={`text-xl font-semibold text-blue-600 group-hover:text-blue-800 transition ${
                post.user.userId === userId
                  ? "inline-block max-w-[6em] overflow-hidden text-ellipsis whitespace-nowrap align-middle"
                  : "whitespace-nowrap"
              }`}
            >
              {post.user.username}
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {post.user.userId === userId && (
            <>
              <Link
                href={{
                  pathname: `/post/${post.id}/edit`,
                  query: {
                    returnUrl:
                      typeof window !== "undefined"
                        ? `${window.location.pathname}?activeTab=${activeTab}`
                        : "",
                  },
                }}
              >
                <button className="text-blue-500 hover:text-blue-700 focus:outline-none flex items-center justify-center">
                  <FiEdit size={16} />
                </button>
              </Link>
              <button
                onClick={() => confirmDeletePost(post.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none flex items-center justify-center"
              >
                <FaTrashAlt size={16} />
              </button>
            </>
          )}
          <span className="text-sm text-gray-500 whitespace-nowrap leading-none">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="text-gray-700 mt-5 mb-4 leading-relaxed whitespace-pre-wrap break-words pl-10 pr-2">
        {post.content.length > 280
          ? `${post.content.slice(0, 280)}...`
          : post.content}
      </div>
      {post.image && (
        <ImageWithCacheBusting
          src={post.image}
          alt="Post image"
          className="max-w-full h-auto mx-auto rounded-md shadow-sm cursor-pointer mt-4"
          style={{ maxHeight: "300px", objectFit: "cover" }}
          cacheBust={!!post.justUpdated}
          onClick={() =>
            post.image &&
            openModal(
              post.justUpdated ? `${post.image}?v=${Date.now()}` : post.image
            )
          }
        />
      )}
      <div className="flex justify-end items-center mt-4">
        <button
          onClick={() => toggleLike(post.id)}
          className={`flex items-center text-xl ${
            post.liked ? "text-yellow-500" : "text-gray-500"
          } ${animateLike === post.id ? "animate-pop" : ""}`}
          style={{
            textShadow: post.liked
              ? "0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 4px rgba(0, 0, 0, 0.3)"
              : "0px 0px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          {post.liked ? "★" : "☆"}
          <span className="ml-1 text-gray-600 text-lg">
            {post.likeCount} nice!
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostItem;
