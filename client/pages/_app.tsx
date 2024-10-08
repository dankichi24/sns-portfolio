// _app.tsx
import { AppProps } from "next/app";
import { AuthProvider } from "../lib/authContext"; // AuthProvider をインポート
import "../styles/globals.css"; // グローバルCSSをインポート
import Navbar from "@/components/Navbar"; // 共通の Navbar コンポーネント

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      {/* 共通のナビゲーションバー */}
      <Navbar />
      {/* 各ページのコンポーネント */}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
