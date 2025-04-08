import { useEffect, useState } from "react";

export default function ApiTest() {
  const [message, setMessage] = useState("loading...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error("🔴 API 接続エラー:", err);
        setMessage("接続エラー");
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">API通信テスト</h1>
      <p className="mt-4">結果：{message}</p>
    </div>
  );
}
