"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Device } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UserDevices = () => {
  const { userId } = useParams() as { userId: string };

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!userId) return;

    const fetchUserDevices = async () => {
      setLoading(true);
      try {
        const userResponse = await fetch(`${API_URL}/api/users/${userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUsername(userData.username || "ユーザー");
        }
        const deviceResponse = await fetch(
          `${API_URL}/api/devices?userId=${userId}`
        );
        if (deviceResponse.ok) {
          setDevices(await deviceResponse.json());
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("ユーザーデバイス取得失敗:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDevices();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-600">Now Loading...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-indigo-900 text-center mt-10 mb-8">
        {username} さんの使用デバイス一覧
      </h1>
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border rounded-lg p-6 bg-white shadow-lg flex flex-col items-center"
            >
              <img
                src={device.image}
                alt={device.name}
                className="w-full h-48 rounded-lg object-cover mb-4"
              />
              <span className="text-xl font-bold text-center">
                {device.name}
              </span>
              {device.comment && (
                <p className="text-gray-600 text-center mt-2">
                  {device.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          デバイスが登録されていません。
        </p>
      )}
    </div>
  );
};

export default UserDevices;
