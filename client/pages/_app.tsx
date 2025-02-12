import { AppProps } from "next/app";
import { AuthProvider } from "../lib/authContext";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}

export default MyApp;
