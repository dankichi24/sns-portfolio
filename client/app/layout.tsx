import "@/styles/globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/authContext";
import Navbar from "@/components/ui/Navbar";

export const metadata = {
  title: "Gaming Device Share | ゲーミングデバイス共有SNS",
  description:
    "おすすめのゲーミングデバイスを投稿・共有できるSNSアプリ。プロフィールで自分のデバイスを紹介！",
};

/**
 * アプリ全体のレイアウト（RootLayout）
 *
 * @component
 * @param {Object} props
 * @param {ReactNode} props.children - 配下に表示されるページ・コンポーネント
 * @returns {JSX.Element} HTMLルート構造
 * @description
 * - アプリ全体で`AuthProvider`（認証状態管理）と`Navbar`（ヘッダー）を共通で提供
 * - 各ページを`<main>`でラップして表示
 * - `<html lang="ja">`やメタデータ設定も含むNext.jsのroot layout
 */
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
