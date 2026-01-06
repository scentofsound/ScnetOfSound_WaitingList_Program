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
  <div className="w-screen h-screen bg-[#f7f6f3] flex flex-col">

    {/* 헤더 */}
    <header className="flex-none pt-10 pb-6 mb-16 text-center">
      <h1 className="text-3xl font-bold">Scenti Waiting Status</h1>
    </header>

    {/* 메인 - 카드들을 균등하게 늘리는 영역 */}
    <main className="flex-1 min-h-0 flex flex-col gap-6 px-4 overflow-hidden">

      {/* 남은 대기열 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
        <p className="text-gray-500 text-xl">People Waiting</p>
        <p className="text-5xl font-extrabold mt-2">{waitingCount} team</p>
      </div>

      {/* 당신의 번호 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
        <p className="text-gray-500 text-xl">Your Number</p>
        <p className="text-5xl font-extrabold text-indigo-500 mt-2">{ticketNumber}</p>

        {myTurn && (
          <p className="text-gray-600 text-lg mt-2">
            Current Waiting: <span className="font-bold">{myTurn}th</span>
          </p>
        )}
      </div>

      {/* 예상 대기시간 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
        <p className="text-gray-500 text-xl">Estimated Wait Time</p>
        <p className="text-6xl font-extrabold text-indigo-500 mt-4">{estimatedTime} min</p>
      </div>

    </main>

    {/* 푸터 */}
    <footer className="flex-none mt-6 pb-4 text-center text-gray-400 text-sm">
      Update automatically every 2 seconds
    </footer>

  </div>
);

}
