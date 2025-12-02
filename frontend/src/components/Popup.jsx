// src/components/Popup.jsx
import React from "react";

export default function Popup({ message, buttonText = "닫기", onClose }) {
  return (
        // <div className="fixed inset-0 flex justify-center items-center 
        //                 backdrop-blur-sm bg-[rgba(0,0,0,0.10)] z-50">
      <div className="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.18)] z-50">

      <div className="bg-white rounded-3xl p-10 shadow-xl w-[500px] text-center">

        <p className="text-4xl font-bold mb-8">{message}</p>

        <button
          onClick={onClose}
          className="px-8 py-4 bg-black text-white text-3xl rounded-2xl hover:bg-gray-800 transition"
        >
          {buttonText}
        </button>

      </div>
    </div>
  );
}
