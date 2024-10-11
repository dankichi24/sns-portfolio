import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "./apiClient";
import { useRouter } from "next/router";

interface User {
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const router = useRouter();

  // ページがロードされたときにトークンを確認し、ユーザーを復元する
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token found:", token); // ← ここでトークンを確認
    if (token) {
      apiClient
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Full API Response from /me:", response.data); // レスポンス全体を確認
          setUser(response.data); // response.data に直接ユーザー情報が含まれているかもしれない
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          localStorage.removeItem("authToken");
        })
        .finally(() => {
          setIsLoading(false); // ローディング完了
        });
    } else {
      setIsLoading(false); // トークンがない場合もローディング完了
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    router.push("/"); // ログアウト後にリダイレクト
  };

  if (isLoading) {
    return <div>Loading...</div>; // ローディング中の表示
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
