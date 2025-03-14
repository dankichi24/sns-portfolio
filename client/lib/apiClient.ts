import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // クッキー送受信が必要なら付ける
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストインターセプターを追加して、毎回トークンをヘッダーに含める
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // キャッシュ無効化のヘッダーを追加
  Object.assign(config.headers, {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  });

  return config;
});

export default apiClient;
