// src/pages/WaitingPage.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/config";
import ScentiLogo from "../assets/scenti.svg?react";
import Popup from "../components/Popup";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";



export default function WaitingPage() {
  const { serviceName = "perfume" } = useParams();
  const [baseWaitingTime, setBaseWaitingTime] = useState(0);
  const [people, setPeople] = useState("");
  const [waitingCount, setWaitingCount] = useState(0);
  const [nextNumber, setNextNumber] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const [showPopup, setShowPopup] = useState(false);

  const [generatedQrUrl, setGeneratedQrUrl] = useState(null);
  const [generatedTicket, setGeneratedTicket] = useState(null);


  const SERVICE_LABEL = {
    perfume: "Perfume Waiting",
    air_freshener: "Air Freshener Waiting",
  };
  const serviceLabel = SERVICE_LABEL[serviceName] || serviceName;

  const AVERAGE_TIME = 3; // 평균 체험시간(분)

const fetchWaitingList = async () => {
  const res = await fetch(`${API_BASE_URL}/waiting/${serviceName}`);
  const list = await res.json();

  const active = list.filter(i => i.status === "active");
  const totalPeople = active.reduce((sum, item) => sum + (item.people || 1), 0);

  setWaitingCount(active.length);

  if (list.length === 0) setNextNumber(1);
  else setNextNumber(list[list.length - 1].ticket_number + 1);

  // 🔥 다른 팀들의 순수 대기시간만 저장
  setBaseWaitingTime(totalPeople * AVERAGE_TIME);
};


  // 📌 대기열 정보 가져오기
// const fetchWaitingList = async () => {
//   const res = await fetch(`${API_BASE_URL}/waiting/${serviceName}`);
//   const list = await res.json();

//   // list가 배열인지 안전하게 체크
//   if (!Array.isArray(list)) {
//     console.error("API returned non-array:", list);
//     return;
//   }

//   // 대기중 팀 필터
//   const active = list.filter((i) => i.status === "active");
//   const totalPeople = active.reduce((sum, item) => sum + (item.people || 1), 0);

//   setWaitingCount(active.length);

//   // nextNumber 계산: ticket_number 기준
//   setNextNumber(list[list.length - 1].ticket_number + 1);


//   // 예상 대기시간 계산
//   const waitingTime = totalPeople * AVERAGE_TIME;
//   const myTime = (parseInt(people || 0) || 0) * AVERAGE_TIME;
//   setEstimatedTime(waitingTime + myTime);
// };


  // 참여 인원 입력 키패드
const handlePeopleClick = (num) => {
  if (people.length < 2) {
    let newValue = people + num;

    // 숫자 앞자리 0 제거
    newValue = String(Number(newValue));

    setPeople(newValue);
  }
};


  const handlePeopleBack = () => {
    setPeople((prev) => prev.slice(0, -1));
  };



  const handlePhoneBack = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleButtonPress = (e) => {
  const el = e.currentTarget;
  el.classList.add("pressed");

  setTimeout(() => {
    el.classList.remove("pressed");
  }, 200);
};


// const handleSubmit = async () => {
//   const res = await fetch(`${API_BASE_URL}/waiting/${serviceName}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ people }),
//   });

//   const data = await res.json();

//   setShowPopup(true);
//   setPeople("");

//   fetchWaitingList(); // 새로고침
// };

const handleSubmit = async () => {
  const res = await fetch(`${API_BASE_URL}/waiting/${serviceName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ people }),
  });

  const data = await res.json();

  // 새로 발급된 번호
  const ticket = data.ticket_number;

  // QR 페이지 URL
  const qrUrl = `${window.location.origin}/status/${serviceName}/${ticket}`;

  console.log("QR URL:", qrUrl);

  // 팝업 등에 전달할 수 있게 상태 저장
  setGeneratedQrUrl(qrUrl);
  setGeneratedTicket(ticket);

  setShowPopup(true);   // 팝업 열기
  setPeople("");

  fetchWaitingList();
};


  useEffect(() => {
    const myTime = (people ? Number(people) : 0) * AVERAGE_TIME;
    setEstimatedTime(baseWaitingTime + myTime);
  }, [baseWaitingTime]);



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

      <h1 className="text-[40px] font-bold mb-6">
        Waiting Scenti – {serviceLabel}
      </h1>

        {/* 상단 두 개 카드 */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-gray-50 rounded-2xl shadow-sm p-8 h-80 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-3xl mb-2">남은 대기열</p>
            <p className="text-7xl font-extrabold">{waitingCount}팀</p>
          </div>

          {/* <div className="bg-gray-50 rounded-2xl shadow-sm p-8 h-80 flex flex-col justify-center items-center">
            <p className="text-gray-500 text-3xl mb-2">등록 시 번호</p>
            <p className="text-7xl font-extrabold text-indigo-400">{nextNumber}번</p>
          </div> */}
        </div>

        {/* 🔥 대형 예상 대기시간 카드 */}
        <div className="flex-1 bg-gray-50 rounded-2xl shadow-sm p-8 flex flex-col justify-center items-center">
          <p className="text-gray-500 text-4xl mb-6">예상 대기시간</p>
          <p className="text-8xl font-extrabold text-indigo-500">
            {estimatedTime}분
          </p>
        </div>

      </div>


        {/* RIGHT CARD */}
        <div className="flex-1 bg-white rounded-3xl shadow-md p-8 flex flex-col">

          {
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
                onClick={(e) => {
                  handleButtonPress(e);
                  handlePeopleClick(num);
                }}
                className="keypad-btn bg-gray-100 rounded-xl text-8xl font-semibold transition-transform"
              >
                {num}
              </button>

                ))}
                <button onClick={(e) => {
                  handlePeopleBack()
                  handleButtonPress(e);
                  }} className="keypad-btn bg-gray-200 rounded-xl text-8xl">
                  ←
                </button>
                <button onClick={(e) => {
                  handleButtonPress(e);
                  handlePeopleClick(0);
                }}
                  className="keypad-btn bg-gray-100 rounded-xl text-8xl">
                  0
                </button>
                <button
                  onClick={() => {
                    if (people) handleSubmit();
                  }}
                  className="
                    bg-black text-white rounded-xl text-5xl font-bold
                    active:bg-gray-800 active:scale-95
                    transition transform
                  "
                >
                  다음
                </button>
              </div>
            </>
          }
        </div>
      </div>
      {showPopup && (
        <Popup
        message={
          <div className="flex flex-col items-center gap-4">
            <p className="text-3xl font-bold">등록 완료!</p>
            <QRCode value={generatedQrUrl} size={180} />
            <p className="text-gray-500 text-xl">
              당신의 번호는 {generatedTicket}번입니다.
            </p>
          </div>
        }
        onClose={() => setShowPopup(false)}
      />
      )}
    </div>
  );
}
