// // src/App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import WaitingPage from "./pages/WaitingPage";
// import AdminHome from "./admin/AdminHome";
// import "./output.css";   // 필수!


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<WaitingPage />} />
//         <Route path="/admin" element={<AdminHome />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WaitingPage from "./pages/WaitingPage";
import AdminHome from "./admin/AdminHome";
import UserStatusPage from "./pages/UserStatusPage";
import "./output.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본은 perfume 으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/perfume" replace />} />

        {/* 서비스별 웨이팅 페이지 */}
        <Route path="/:serviceName" element={<WaitingPage />} />

        {/* 서비스별 관리자 페이지 */}
        <Route path="/admin/:serviceName" element={<AdminHome />} />

        <Route path="/status/:serviceName/:ticketNumber" element={<UserStatusPage />} />

      </Routes>
    </Router>
  );
}

export default App;
