import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "../../lib/apiClient";

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await apiClient.get(`/api/posts/${id}`);
          setContent(response.data.content);
          setCurrentImageUrl(response.data.image);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);

      // 新しい画像のプレビューを設定
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

      router.push("/home");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCancel = () => {
    router.push("/home");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
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
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Edit your thoughts..."
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2 text-lg">
            画像の更新（任意）:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {currentImageUrl && !preview && (
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-lg">
              現在の画像:
            </label>
            <img
              src={`http://localhost:5000${currentImageUrl}`}
              alt="Current post image"
              className="w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}
        {preview && (
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-lg">
              新しい画像のプレビュー:
            </label>
            <img
              src={preview}
              alt="New post image"
              className="w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
