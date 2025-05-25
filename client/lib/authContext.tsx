/**
 * 認証状態管理用のReact Contextとカスタムフック
 *
 * @module AuthContext
 * @description
 * - グローバルな認証ユーザー情報（user）、ログイン/ログアウト、ローディング状態、ユーザー情報更新を提供。
 * - `AuthProvider`でツリーをラップし、`useAuth`フックでどこでも認証情報にアクセスできる。
 * - ログイン時はtokenをlocalStorage保存し、自動でAPIからユーザー情報を取得する。
 * - ログアウト時は認証情報をクリアしてトップページにリダイレクト。
 */

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export interface User {
  userId: number;
  username: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      apiClient
        .get("/api/auth/me")
        .then((response) => {
          if (response.data.userId) {
            setUser({
              userId: response.data.userId,
              username: response.data.username,
              email: response.data.email,
              image: response.data.image,
            });
          }
        })
        .catch((error) => {
          if (error.response?.status === 403) {
            console.warn("未認証: /auth/me アクセス拒否（403）");
          } else {
            console.error("認証情報取得に失敗しました:", error);
          }
          localStorage.removeItem("authToken");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    router.push("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
