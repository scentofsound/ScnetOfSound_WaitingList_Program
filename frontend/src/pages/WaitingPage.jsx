// src/pages/WaitingPage.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";
import ScentiLogo from "../assets/scenti.svg?react";
import Popup from "../components/Popup";


export default function WaitingPage() {
  const [step, setStep] = useState(1); // 1: 인원 입력, 2: 전화번호 입력
  const [people, setPeople] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [waitingCount, setWaitingCount] = useState(0);
  const [nextNumber, setNextNumber] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const [showPopup, setShowPopup] = useState(false);


  const AVERAGE_TIME = 3; // 평균 체험시간(분)

  // 📌 대기열 정보 가져오기
  const fetchWaitingList = async () => {
    const res = await fetch(`${API_BASE_URL}/waiting/`);
    const list = await res.json();

    // 대기중 팀
    const active = list.filter((i) => i.status === "대기중");
    const totalPeople = active.reduce((sum, item) => sum + (item.people || 1), 0);

    setWaitingCount(active.length);

    if (list.length === 0) setNextNumber(1);
    else setNextNumber(list[list.length - 1].id + 1);

    // 예상 대기시간 계산
    const waitingTime = totalPeople * AVERAGE_TIME;
    const myTime = (parseInt(people || 0) || 0) * AVERAGE_TIME;
    setEstimatedTime(waitingTime + myTime);
  };

  // 참여 인원 입력 키패드
  const handlePeopleClick = (num) => {
    if (people.length < 2) {
      setPeople((prev) => prev + num);
    }
  };

  const handlePeopleBack = () => {
    setPeople((prev) => prev.slice(0, -1));
  };

  // 전화번호 포맷팅
  const formatPhone = (num) => {
    if (!num) return "010-";
    if (num.length < 4) return `010-${num}`;
    if (num.length < 8) return `010-${num.slice(0, 4)}-${num.slice(4)}`;
    return `010-${num.slice(0, 4)}-${num.slice(4, 8)}`;
  };

  const handlePhoneClick = (num) => {
    if (phoneNumber.length < 8) {
      setPhoneNumber((prev) => prev + num);
    }
  };

  const handlePhoneBack = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  // 📌 최종 등록하기
  const handleSubmit = async () => {
    const formatted = formatPhone(phoneNumber);

    const payload = JSON.stringify({ phone: formatted, people })

    const res = await fetch(`${API_BASE_URL}/waiting/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    const res2 = await fetch(`${API_BASE_URL}/send_sms/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    console.log("data: " + JSON.stringify({ phone: formatted, people }))

    const data = await res.json();
    const data_sms = await res2.json();
    console.log("data_sms: ", data_sms)
    // 팝업 띄우기
    setShowPopup(true);

    // 입력 초기화
    setPhoneNumber("");
    setStep(1);
  };


  useEffect(() => {
    fetchWaitingList();
    const interval = setInterval(fetchWaitingList, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#f7f6f3] flex justify-center items-center">
      
      {/* 로고 */}
      <div className="absolute top-12 right-20 transform -translate-y-1/10">
        <ScentiLogo className="w-72 h-auto" />
      </div>

      <div className="w-[90%] h-[80%] flex gap-8">
        
          {/* LEFT CARD */}
      <div className="flex-1 relative bg-white rounded-3xl shadow-md p-8 flex flex-col">

        <h1 className="text-4xl font-bold text-center mb-8">Waiting Scenti</h1>

        {/* 상단 두 개 카드 */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-2xl shadow-sm p-8 h-80 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-3xl mb-2">남은 대기열</p>
            <p className="text-7xl font-extrabold">{waitingCount}팀</p>
          </div>

          <div className="bg-gray-50 rounded-2xl shadow-sm p-8 h-80 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-3xl mb-2">등록 시 번호</p>
            <p className="text-7xl font-extrabold text-indigo-400">{nextNumber}번</p>
          </div>
        </div>

        {/* 🔥 대형 예상 대기시간 카드 */}
        <div className="flex-1 bg-gray-50 rounded-2xl shadow-sm p-8 flex flex-col justify-center items-center">
          <p className="text-gray-500 text-4xl mb-6">예상 대기시간</p>
          <p className="text-8xl font-extrabold text-indigo-500">{estimatedTime}분</p>
        </div>

      </div>


        {/* RIGHT CARD */}
        <div className="flex-1 bg-white rounded-3xl shadow-md p-8 flex flex-col">

          {step === 1 && (
            <>
              <div className="text-center text-4xl font-bold mb-8">참여 인원 입력</div>
              <input
                value={people ? `${people}명` : ""}
                readOnly
                className="text-center text-6xl bg-gray-100 rounded-xl py-4 mb-6"
              />

              {/* keypad */}
              <div className="grid grid-cols-3 gap-4 flex-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePeopleClick(num)}
                    className="bg-gray-100 rounded-xl text-8xl font-semibold hover:bg-gray-200 transition"
                  >
                    {num}
                  </button>
                ))}
                <button onClick={handlePeopleBack} className="bg-gray-200 rounded-xl text-8xl">
                  ←
                </button>
                <button onClick={() => handlePeopleClick(0)} className="bg-gray-100 rounded-xl text-8xl">
                  0
                </button>
                <button
                  onClick={() => people && setStep(2)}
                  className="bg-black text-white rounded-xl text-5xl font-bold hover:bg-gray-800 transition"
                >
                  다음
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>

              {/* 상단 3분할 위젯 */}
              <div className="grid grid-cols-3 gap-4 mb-6">

                {/* 1. 참여 인원 수정 */}
                <button
                  onClick={() => setStep(1)}
                  className="h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-gray-500 hover:bg-gray-300 transition"
                >
                  ← 참여 인원 수정
                </button>

                {/* 2. 제목 */}
                <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold">
                  전화번호 입력
                </div>

                {/* 3. 참여 인원 표시 */}
                <div className="h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-indigo-500">
                  참여인원: {people}명
                </div>

              </div>


              {/* 전화번호 입력창 */}
              <input
                value={formatPhone(phoneNumber)}
                readOnly
                className="text-center text-6xl bg-gray-100 rounded-xl py-4 mb-6"
              />

              {/* 키패드 */}
              <div className="grid grid-cols-3 gap-4 flex-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePhoneClick(num)}
                    className="bg-gray-100 rounded-xl text-8xl font-semibold hover:bg-gray-200 transition"
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={handlePhoneBack}
                  className="bg-gray-200 rounded-xl text-8xl hover:bg-gray-300 transition"
                >
                  ←
                </button>

                <button
                  onClick={() => handlePhoneClick(0)}
                  className="bg-gray-100 rounded-xl text-8xl hover:bg-gray-200 transition"
                >
                  0
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-black text-white rounded-xl text-5xl font-bold hover:bg-gray-800 transition"
                >
                  등록하기
                </button>
              </div>
            </>
          )}

        </div>
      </div>
      {showPopup && (
        <Popup
          message="등록 완료되었습니다."
          buttonText="닫기"
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}
