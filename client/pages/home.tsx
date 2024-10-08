// home.tsx
import React, { useState } from "react";

const deviceList = [
  { id: 1, username: "name", color: "bg-green-700", starCount: 2 },
  {
    id: 2,
    username: "name",
    color: "bg-blue-800",
    starCount: 3,
    isStarred: true,
  },
  { id: 3, username: "me", color: "bg-red-600", starCount: 0 },
];

const Home = () => {
  const [devices, setDevices] = useState(deviceList);

  // スターを切り替える処理
  const toggleStar = (id: number) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, isStarred: !device.isStarred } : device
      )
    );
  };

  return (
    <main className="container mx-auto mt-8">
      <h2 className="text-4xl font-bold text-center mb-6">ホーム画面</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between p-4 border-b last:border-b-0"
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full ${device.color} mr-4`} />
              <span className="font-bold text-lg">{device.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`cursor-pointer ${
                  device.isStarred ? "text-blue-500" : "text-gray-400"
                }`}
                onClick={() => toggleStar(device.id)}
              >
                {device.isStarred ? "★" : "☆"}
              </span>
              <span className="text-lg font-bold">
                {device.starCount + (device.isStarred ? 1 : 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
