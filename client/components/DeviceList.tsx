import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/authContext"; // 認証コンテキストをインポート

interface Device {
  id: number;
  name: string;
  image: string;
}

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceImage, setNewDeviceImage] = useState<File | null>(null);
  const { user } = useAuth(); // 現在ログイン中のユーザーを取得

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user) return; // ユーザーがログインしていない場合は何もしない

      try {
        const response = await fetch(
          `http://localhost:5000/api/devices?userId=${user.userId}` // 動的にuserIdを設定
        );
        if (response.ok) {
          const data = await response.json();
          setDevices(data);
        } else {
          console.error("デバイスリストの取得に失敗しました。");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    fetchDevices();
  }, [user]);

  const addDevice = async () => {
    if (!newDeviceName || !newDeviceImage) {
      alert("デバイス名と画像を追加してください。");
      return;
    }

    if (!user) {
      alert("ログインしていません。");
      return;
    }

    const formData = new FormData();
    formData.append("name", newDeviceName);
    formData.append("image", newDeviceImage);
    formData.append("userId", String(user.userId)); // ログイン中のユーザーIDを送信

    try {
      const response = await fetch("http://localhost:5000/api/devices/add", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const device = await response.json();
        setDevices((prevDevices) => [...prevDevices, device]);
        setNewDeviceName("");
        setNewDeviceImage(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "デバイスの登録に失敗しました。");
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  };

  return (
    <div className="flex flex-col items-center px-4">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
        使用デバイス一覧
      </h2>

      <div className="flex flex-wrap gap-8 w-full max-w-7xl justify-center">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-md w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addDevice();
            }}
            className="flex flex-col space-y-4 items-center"
          >
            <div>
              <label
                htmlFor="device-name"
                className="block text-sm font-medium text-gray-700"
              >
                デバイス名
              </label>
              <input
                id="device-name"
                type="text"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
                placeholder="デバイス名を入力"
                className="border rounded-md px-4 py-2 w-full mt-1 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="device-image"
                className="block text-sm font-medium text-gray-700"
              >
                デバイス画像
              </label>
              <input
                id="device-image"
                type="file"
                accept="image/*"
                onChange={(e) => setNewDeviceImage(e.target.files?.[0] || null)}
                className="block w-full text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition duration-300 w-32"
            >
              デバイスを追加
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border rounded-lg p-6 bg-white shadow-lg flex flex-col items-center w-64"
            >
              <img
                src={`http://localhost:5000${device.image}`}
                alt={device.name}
                className="w-full h-48 rounded-lg object-cover mb-4"
              />
              <span className="text-xl font-bold text-center">
                {device.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceList;
