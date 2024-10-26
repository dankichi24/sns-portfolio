import { useState } from "react";
import { useRouter } from "next/router";
import apiClient from "../../lib/apiClient"; // APIクライアントがあると仮定

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null); // 画像を扱うためのstate
  const [preview, setPreview] = useState<string | null>(null); // プレビュー画像のURLを保持するstate
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file); // ファイルをData URLとして読み込む
    } else {
      setPreview(null); // ファイルがクリアされた場合、プレビューもクリア
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(); // フォームデータを使用してコンテンツ、画像を送信
    formData.append("content", content);
    if (image) {
      formData.append("image", image); // 画像があれば追加
    }

    // 送信するデータをログに表示
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    console.log(
      "Authorization Header:",
      `Bearer ${localStorage.getItem("token")}`
    );

    try {
      // APIにPOSTリクエストを送信
      const response = await apiClient.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // トークンが設定されていることを確認
        },
      });

      // 投稿成功時の処理（ホームにリダイレクトなど）
      if (response.status === 201) {
        router.push("/home");
      }
    } catch (error) {
      console.error("Error creating post", error);
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
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-lg">
              Image (optional)
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
                className="w-full h-auto rounded-lg shadow-md"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
