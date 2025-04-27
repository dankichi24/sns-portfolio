"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Device {
  id: number;
  name: string;
  image: string;
  comment?: string;
}

const DeviceList: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceImage, setNewDeviceImage] = useState<File | null>(null);
  const [newDeviceComment, setNewDeviceComment] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.userId) return;

    const fetchDevices = async () => {
      const response = await fetch(
        `${API_URL}/api/devices?userId=${user.userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setDevices(data);
      }
    };

    fetchDevices();
  }, [user?.userId]);

  const addDevice = async () => {
    if (!user) {
      alert("ログインしていません。");
      return;
    }

    if (newDeviceName.length > 30) {
      setErrorMessage("デバイス名は30文字以内で入力してください。");
      return;
    }

    const formData = new FormData();
    formData.append("name", newDeviceName);
    if (newDeviceImage) {
      formData.append("image", newDeviceImage);
    }
    formData.append("comment", newDeviceComment || "");
    formData.append("userId", String(user.userId));

    try {
      const response = await fetch(`${API_URL}/api/devices/add`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const device = await response.json();
        setDevices((prevDevices) => [...prevDevices, device]);
        setNewDeviceName("");
        setNewDeviceImage(null);
        setNewDeviceComment("");
        setPreviewUrl(null);
        setErrorMessage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "デバイスの登録に失敗しました。");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("デバイス追加エラー:", error);
      }
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
        `${API_URL}/api/devices/delete/${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );
      } else {
        alert("デバイスの削除に失敗しました。");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("デバイス削除中にエラーが発生しました:", error);
      }
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
            <div className="w-full">
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
                onChange={(e) => {
                  setNewDeviceName(e.target.value);
                  if (e.target.value.length <= 30) {
                    setErrorMessage(null);
                  }
                }}
                placeholder="デバイス名を入力"
                className="border rounded-md px-4 py-2 w-full mt-1 text-sm"
                required
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>
            <div className="w-full">
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
                className="border rounded-md px-4 py-2 w-full mt-1 text-sm resize-y"
                rows={3}
              />
            </div>

            <div className="w-full text-center">
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
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setNewDeviceImage(file);

                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setPreviewUrl(null);
                  }
                }}
                className="block text-sm mt-1 mx-auto"
              />
            </div>

            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="プレビュー"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition duration-300 w-32 mt-2"
            >
              デバイスを追加
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl place-items-center sm:place-items-start">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border rounded-lg p-6 bg-white shadow-lg flex flex-col items-center w-64 h-[380px]"
            >
              <div className="w-full aspect-[1] bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={device.image || "/no-image.png"}
                  alt={device.name}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <span className="text-xl font-bold text-center">
                {device.name}
              </span>
              <div className="mt-2 w-full h-20 overflow-y-auto px-1">
                <p className="text-gray-600 text-center text-sm break-words whitespace-pre-wrap">
                  {device.comment || ""}
                </p>
              </div>
              <div className="flex-grow" />
              <button
                onClick={() => confirmDeleteDevice(device.id)}
                className="mt-3 bg-red-600 text-white px-4 py-1 text-xs font-medium rounded hover:bg-red-700 transition duration-300"
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
