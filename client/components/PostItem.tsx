// components/PostItem.tsx

import Link from "next/link";
import { FiEdit } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa";
import { Post } from "../types";

interface PostItemProps {
  post: Post;
  userId: number | null;
  toggleLike: (postId: number) => void;
  confirmDeletePost: (postId: number) => void;
  openModal: (image: string) => void;
  animateLike: number | null;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  userId,
  toggleLike,
  confirmDeletePost,
  openModal,
  animateLike,
}) => {
  return (
    <li className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-blue-600">
          {post.user.username}
        </span>
        <div className="flex items-center">
          {post.user.userId === userId && (
            <>
              <Link href={`/post/edit?id=${post.id}`}>
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
      <div className="text-gray-700 mb-4 leading-relaxed">{post.content}</div>
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt="Post image"
          className="max-w-full h-auto mx-auto rounded-md shadow-sm cursor-pointer"
          style={{ maxHeight: "300px", objectFit: "cover" }}
          onClick={() => openModal(`http://localhost:5000${post.image}`)}
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
    </li>
  );
};

export default PostItem;
