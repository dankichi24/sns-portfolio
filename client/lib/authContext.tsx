import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "./apiClient";
import { useRouter } from "next/router";

interface User {
  userId: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token found:", token);

    if (token) {
      apiClient
        .get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("APIからのユーザーデータ:", response.data); // デバッグログ

          // APIからuserIdが返ってきていることを確認してセット
          if (response.data.userId) {
            setUser({
              userId: response.data.userId,
              username: response.data.username,
              email: response.data.email,
            });
          } else {
            console.error("User data is missing userId:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
          localStorage.removeItem("authToken");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
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
