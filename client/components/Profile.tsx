import React, { useState } from "react";

interface ProfileProps {
  username: string; // ユーザー名のプロパティ
}

const Profile: React.FC<ProfileProps> = ({ username }) => {
  const [devices, setDevices] = useState<string[]>([]);
  const [newDevice, setNewDevice] = useState<string>("");

  const addDevice = () => {
    if (newDevice.trim() !== "") {
      setDevices((prevDevices) => [...prevDevices, newDevice]);
      setNewDevice("");
    }
  };

  return (
    <div className="text-center">
      {/* プロフィール */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-indigo-900 mb-4">
          プロフィール
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-indigo-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4.41 0-8 1.79-8 4v1h16v-1c0-2.21-3.59-4-8-4z"
              />
            </svg>
          </div>
          <div className="text-lg font-semibold text-gray-700">{username}</div>
        </div>
      </div>

      {/* 使用デバイス一覧 */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-indigo-900 mb-6">
          使用デバイス一覧
        </div>

        {/* デバイスリスト */}
        <div className="mb-6">
          <ul>
            {devices.map((device, index) => (
              <li key={index} className="text-lg font-bold mb-2">
                {device}
              </li>
            ))}
          </ul>
        </div>

        {/* デバイス名の追加 */}
        <div className="mb-6">
          <input
            type="text"
            value={newDevice}
            onChange={(e) => setNewDevice(e.target.value)}
            placeholder="デバイス名を追加"
            className="border rounded-md px-4 py-2 w-3/4 mb-2"
          />
          <br />
          <button
            onClick={addDevice}
            className="bg-indigo-900 text-white px-4 py-2 rounded-md mt-2"
          >
            デバイスを追加
          </button>
        </div>
      </div>

      {/* デバイスがまだ追加されていない場合 */}
      {devices.length === 0 && (
        <p className="text-gray-500">デバイスがまだ追加されていません。</p>
      )}
    </div>
  );
};

export default Profile;
