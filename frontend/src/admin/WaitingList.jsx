

// src/admin/WaitingList.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";

export default function WaitingList({ withoutTitle = false }) {
  const [waiting, setWaiting] = useState([]);


 const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ko-KR", { hour12: false });
};


  // 📌 백엔드에서 대기 리스트 불러오기
  const fetchWaiting = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/waiting/`);
      const data = await res.json();

      // created_at → HH:MM 으로 변환
      const formatted = data.map((item) => ({
        ...item,
        time: formatTime(item.created_at),  // HH:MM:SS
      }));

      setWaiting(formatted);
    } catch (err) {
      console.error("대기열 불러오기 실패:", err);
    }
  };

    useEffect(() => {
    const interval = setInterval(() => {
        fetchWaiting();
    }, 1000);

    return () => clearInterval(interval);
    }, []);


  // 호출하기
  const callUser = async (id) => {
    await fetch(`${API_BASE_URL}/admin/call/${id}`, {
      method: "POST",
    });
    fetchWaiting();
  };

  // 스킵하기 (맨 뒤로 이동)
  const skipUser = async (id) => {
    // (`${id}번 고객을 뒤로 이동합니다. (추후 기능 구현)`);
  };

  // 삭제하기
  const deleteUser = async (id) => {
    await fetch(`${API_BASE_URL}/admin/${id}`, {
      method: "DELETE",
    });
    fetchWaiting();
  };

  // 상태 뱃지 색상
  const statusClass = (status) => {
    switch (status) {
      case "호출됨":
        return "bg-blue-100 text-blue-600";
      case "완료":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-10">
      {!withoutTitle && (
        <h1 className="text-4xl font-bold mb-8">대기열 관리</h1>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="text-left border-b">
              <th className="py-3 px-2 text-gray-600 font-semibold">번호</th>
              <th className="px-2 text-gray-600 font-semibold">참여인원</th>
              <th className="px-2 text-gray-600 font-semibold">전화번호</th>
              <th className="px-2 text-gray-600 font-semibold">등록시간</th>
              <th className="px-2 text-gray-600 font-semibold">상태</th>
              <th className="px-2 text-gray-600 font-semibold">관리</th>
            </tr>
          </thead>

          <tbody>
            {waiting.map((u) => (
              <tr
                key={u.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td classname="py-3 px-2 font-bold">{u.id}</td>
                <td className="px-2">{u.people}</td>
                <td className="px-2">{u.phone}</td>
                <td className="px-2">{u.time}</td>

                <td className="px-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(
                      u.status
                    )}`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="px-2">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={() => callUser(u.id)}
                    >
                      호출
                    </button>

                    <button
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      onClick={() => skipUser(u.id)}
                    >
                      스킵
                    </button>

                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      onClick={() => deleteUser(u.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {waiting.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-400">
                  아직 등록된 대기 인원이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
