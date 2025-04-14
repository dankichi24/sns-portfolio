import "@/styles/globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Gaming Device Share | ゲーミングデバイス共有SNS",
  description:
    "おすすめのゲーミングデバイスを投稿・共有できるSNSアプリ。プロフィールで自分のデバイスを紹介！",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
