"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await apiClient.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        router.push("/home");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error creating post:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-12 rounded-xl shadow-xl w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-700 mb-8 text-center">
          Create Post
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-lg">
              本文
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 280) {
                  setContent(e.target.value);
                }
              }}
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts..."
              required
            />
            <p className="text-sm text-gray-500 text-right">
              {content.length}/280
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-lg">
              画像
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {preview && (
            <div className="mb-6">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-md mb-6"
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => router.push("/home")}
              disabled={isSubmitting}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white px-6 py-3 rounded-lg transition shadow-md`}
            >
              {isSubmitting ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
