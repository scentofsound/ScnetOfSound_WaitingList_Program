// src/pages/UserStatusPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/config";
import ScentiLogo from "../assets/scenti.svg?react";

export default function UserStatusPage() {
  const { serviceName, ticketNumber } = useParams();

  const [waitingCount, setWaitingCount] = useState(0);
  const [myTurn, setMyTurn] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const AVERAGE_TIME = 3;

    const fetchStatus = async () => {
    const res = await fetch(`${API_BASE_URL}/waiting/${serviceName}`);
    const list = await res.json();

    const myTicket = Number(ticketNumber);

    // 1) active만 필터링
    const active = list
        .filter((item) => item.status === "active")
        .sort((a, b) => a.ticket_number - b.ticket_number);

    // 2) 내 앞의 팀 계산
    const teamsAhead = active.filter(item => item.ticket_number < myTicket);

    setWaitingCount(teamsAhead.length);   // 🔥 남은 대기열 = 내 앞 팀 수

    // 3) 내 순서
    setMyTurn(teamsAhead.length + 1);

    // 4) 내 앞에 있는 사람 수 계산
    const peopleAhead = teamsAhead.reduce(
        (sum, item) => sum + (item.people || 1),
        0
    );

  setEstimatedTime(peopleAhead * AVERAGE_TIME);  // 🔥 예상 대기시간
};


  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[#f7f6f3] py-6 flex flex-col items-center">

      {/* Logo small top */}
      <ScentiLogo className="w-40 mb-6" />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Scenti Waiting Status</h1>

      {/* Cards */}
      <div className="w-[90%] max-w-md space-y-6">

        {/* 남은 대기열 */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-xl">남은 대기열</p>
          <p className="text-5xl font-extrabold mt-2">{waitingCount}팀</p>
        </div>

        {/* 사용자 번호 */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-xl">당신의 번호</p>
          <p className="text-5xl font-extrabold text-indigo-500 mt-2">
            {ticketNumber}번
          </p>
          {myTurn && (
            <p className="text-gray-600 text-lg mt-2">
              현재 대기 순서: <span className="font-bold">{myTurn}번째</span>
            </p>
          )}
        </div>

        {/* 예상 대기시간 */}
        <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
          <p className="text-gray-500 text-xl">예상 대기시간</p>
          <p className="text-6xl font-extrabold text-indigo-500 mt-4">
            {estimatedTime}분
          </p>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-10">자동으로 2초마다 업데이트됩니다.</p>
    </div>
  );
}
