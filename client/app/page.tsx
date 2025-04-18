"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export const metadata = {
  title: "Gaming Device Share | ゲーミングデバイス共有SNS",
  description:
    "おすすめのゲーミングデバイスを投稿・共有できるSNSアプリ。プロフィールで自分のデバイスを紹介！",
};

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="flex-grow container px-4 py-8 sm:p-12 text-center bg-white shadow-md rounded-md mt-4 max-w-8xl">
        <h2 className="text-3xl sm:text-7xl font-bold text-indigo-600 mb-8 sm:mb-16 leading-snug sm:leading-tight">
          Gaming Device Share <span className="text-black">とは</span>
        </h2>
        <p className="text-base sm:text-5xl text-gray-800 leading-relaxed sm:leading-relaxed">
          自分のおすすめのゲーミングデバイスを投稿したり、
          <br />
          他人のおすすめしているゲーミングデバイスを閲覧する事ができます。
          <br />
          またプロフィールには、現在使用しているゲーミングデバイスを登録できます。
          <br />
          プロフィールは他の人も閲覧可能です。
        </p>
      </main>
    </div>
  );
}
