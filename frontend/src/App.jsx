// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WaitingPage from "./pages/WaitingPage";
import AdminHome from "./admin/AdminHome";
import "./output.css";   // 필수!


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WaitingPage />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </Router>
  );
}

export default App;
