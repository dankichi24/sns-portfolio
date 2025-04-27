"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

const EditPost = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const router = useRouter();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await apiClient.get(`/api/posts/${id}`);
          setContent(response.data.content);
          setCurrentImageUrl(response.data.image);
          setIsLoading(false);
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            console.error("Error fetching post:", error);
          }
        }
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await apiClient.put(`/api/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push(returnUrl || "/home");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error updating post:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(returnUrl || "/home");
  };

  if (isLoading) {
    return (
      <div>
        <p className="text-center text-lg text-gray-500">Now Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-12 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-700">
          Edit Post
        </h2>

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
            placeholder="Edit your thoughts..."
          />
          <p className="text-sm text-gray-500 text-right">
            {content.length}/280
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2 text-lg">
            画像の更新
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {currentImageUrl && !preview && (
          <img
            src={currentImageUrl}
            alt="Current post image"
            className="w-full h-auto rounded-lg shadow-md mb-6"
          />
        )}

        {preview && (
          <img
            src={preview}
            alt="New post preview"
            className="w-full h-auto rounded-lg shadow-md mb-6"
          />
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className={`${
              isSubmitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white px-6 py-3 rounded-lg transition shadow-md`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
