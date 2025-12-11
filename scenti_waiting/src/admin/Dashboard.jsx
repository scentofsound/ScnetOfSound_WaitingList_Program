


// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";
import StatCard from "./components/Statcard";

export default function Dashboard({ withoutTitle = false }) {
  const [stats, setStats] = useState({
    estimatedTime: 0,
    totalPeople: 0,
    completedToday: 0,
    smsFailed: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", { hour12: false });
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/waiting`);
      const list = await res.json();

      // people=null 이면 0으로 처리
      const totalPeople = list.reduce(
        (sum, u) => sum + (u.people ?? 0),
        0
      );

      const estimatedTime = totalPeople * 3; // 1인당 3분

      setStats({
        estimatedTime,
        totalPeople,
        completedToday: list.filter((i) => i.status === "완료").length,
        smsFailed: 0,
      });

      const recent = list
        .slice(-5)
        .reverse()
        .map((item) => ({
          id: item.id,
          phone: item.phone,
          time: item.created_at ? formatTime(item.created_at) : "-",
        }));

      setRecentUsers(recent);

      setRecentLogs([]);
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

      <div className="grid grid-cols-4 gap-6">
        <StatCard title="대기시간" value={`${stats.estimatedTime}분`} />
        <StatCard title="참여인원" value={`${stats.totalPeople}명`} />
        <StatCard title="현재 완료 인원" value={stats.completedToday} />
        <StatCard title="SMS 실패" value={stats.smsFailed} highlight />
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">최근 등록</h2>
      <div className="bg-white rounded-xl shadow p-6">
        {recentUsers.map((u) => (
          <div key={u.id} className="flex justify-between py-2 border-b">
            <span>{u.phone}</span>
            <span className="text-gray-500">{u.time}</span>
          </div>
        ))}
        {recentUsers.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            등록된 사용자가 없습니다.
          </p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">최근 SMS 로그</h2>
      <div className="bg-white rounded-xl shadow p-6">
        {recentLogs.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            SMS 로그가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
