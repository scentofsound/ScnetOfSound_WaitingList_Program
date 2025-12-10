// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";
import StatCard from "./components/Statcard";

export default function Dashboard({ withoutTitle = false, serviceName }) {
  const [stats, setStats] = useState({
    estimatedTime: 0,
    totalPeople: 0,
    completedToday: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", { hour12: false });
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/waiting/${serviceName}`);
      const list = await res.json();

      // -----------------------------
      // 🔥 active 상태만 계산에 포함
      // -----------------------------
      const active = list.filter(
        (u) => u.status === "active" || u.status === "호출됨" || u.status === "called"
      );

      const totalPeople = active.reduce(
        (sum, u) => sum + (u.people ?? 0),
        0
      );

      const estimatedTime = totalPeople * 3; // 1인당 3분 (네 구조 유지)

      const completedToday = list.filter(
        (u) => u.status === "완료" || u.status === "done"
      ).length;

      setStats({
        estimatedTime,
        totalPeople,
        completedToday,
      });

      // -----------------------------
      // 🔥 최근 등록 목록 (삭제/완료도 포함 OK)
      // -----------------------------
      const recent = list
        .slice(-5)
        .reverse()
        .map((item) => ({
          ticket: item.ticket_number,
          people: item.people,
          time: item.created_at ? formatTime(item.created_at) : "-",
          status: item.status,
        }));

      setRecentUsers(recent);
      
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10">
      {!withoutTitle && <h1 className="text-4xl font-bold mb-8">Dashboard</h1>}

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="예상 대기시간" value={`${stats.estimatedTime}분`} />
        <StatCard title="현재 대기 인원" value={`${stats.totalPeople}명`} />
        <StatCard title="오늘 완료된 팀" value={stats.completedToday} />
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">최근 등록</h2>
      <div className="bg-white rounded-xl shadow p-6">
        {recentUsers.map((u, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b">
            <span>{u.ticket}번</span>
            <span>{u.people}명</span>
            <span className="text-gray-500">{u.time}</span>
          </div>
        ))}

        {recentUsers.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            등록된 사용자가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
