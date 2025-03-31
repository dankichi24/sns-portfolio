import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
console.log("🚀 API Base URL:", baseURL);

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // クッキーを送受信する場合は true
  headers: {
    "Content-Type": "application/json",
  },
});

// キャッシュを無効化するエンドポイント
const noCacheEndpoints = ["/api/posts", "/api/users"];

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // キャッシュ無効化を適用するAPIにのみ適用
  if (noCacheEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
    config.headers["Cache-Control"] = "no-cache";
  }

  return config;
});

export default apiClient;
