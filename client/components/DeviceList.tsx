import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/authContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// SweetAlert2の設定
const MySwal = withReactContent(Swal);

interface Device {
  id: number;
  name: string;
  image: string;
  comment?: string; // コメントを追加
}

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceImage, setNewDeviceImage] = useState<File | null>(null);
  const [newDeviceComment, setNewDeviceComment] = useState(""); // コメント状態を追加
  const fileInputRef = useRef<HTMLInputElement>(null); // ファイル入力の ref を定義
  const { user } = useAuth();

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/devices?userId=${user.userId}`
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
      alert("デバイス名と画像を入力してください。");
      return;
    }

    if (!user) {
      alert("ログインしていません。");
      return;
    }

    const formData = new FormData();
    formData.append("name", newDeviceName);
    formData.append("image", newDeviceImage);
    formData.append("comment", newDeviceComment || ""); // 空の場合は空文字列を送信
    formData.append("userId", String(user.userId));

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
        setNewDeviceComment(""); // コメントをリセット

        // ファイル入力をリセット
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "デバイスの登録に失敗しました。");
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。");
    }
  };

  const confirmDeleteDevice = (deviceId: number) => {
    MySwal.fire({
      title: "削除してもよろしいですか？",
      text: "この操作は元に戻せません。",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "削除",
      cancelButtonText: "キャンセル",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDevice(deviceId);
      }
    });
  };

  const deleteDevice = async (deviceId: number) => {
    if (!user) {
      alert("ログインしていません。");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/delete/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );
        // 削除成功時のアラートを削除またはコメントアウト
        // alert("デバイスを削除しました。");
      } else {
        alert("デバイスの削除に失敗しました。");
      }
    } catch (error) {
      console.error("デバイス削除中にエラーが発生しました:", error);
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
                htmlFor="device-comment"
                className="block text-sm font-medium text-gray-700"
              >
                コメント
              </label>
              <textarea
                id="device-comment"
                value={newDeviceComment}
                onChange={(e) => setNewDeviceComment(e.target.value)}
                placeholder="コメントを入力"
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
                ref={fileInputRef} // ref を設定
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
              {device.comment && (
                <p className="text-gray-600 text-center mt-2">
                  {device.comment}
                </p>
              )}
              <button
                onClick={() => confirmDeleteDevice(device.id)}
                className="mt-2 bg-red-600 text-white px-2 py-1 text-xs font-medium rounded hover:bg-red-700 transition duration-300"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceList;
