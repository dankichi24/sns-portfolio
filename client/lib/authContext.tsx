"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
          if (process.env.NODE_ENV !== "production") {
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
