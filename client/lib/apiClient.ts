/**
 * 共通APIクライアント（axiosインスタンス）
 *
 * @module apiClient
 * @description
 * アプリ全体で利用するaxiosの共通インスタンス。
 * - ベースURLは環境変数 `NEXT_PUBLIC_API_URL`（なければlocalhost）を使用
 * - リクエスト時に `authToken` を自動付与（Bearer認証）
 * - `/api/posts` と `/api/users` はno-cacheヘッダー付与でキャッシュ抑止
 * - withCredentials: true でCookie送信も対応
 */

import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const noCacheEndpoints = ["/api/posts", "/api/users"];

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (noCacheEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
    config.headers["Cache-Control"] = "no-cache";
  }

  return config;
});

export default apiClient;
