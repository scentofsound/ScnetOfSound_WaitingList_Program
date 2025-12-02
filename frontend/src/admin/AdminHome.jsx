// src/admin/AdminHome.jsx
import Dashboard from "./Dashboard";
import WaitingList from "./WaitingList";

export default function AdminHome() {
  return (
    <div className="w-screen h-screen p-6 bg-gray-50 overflow-auto">

      <h1 className="text-4xl font-bold mb-6">Admin Panel</h1>

      {/* 좌우 반반 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Dashboard */}
        <div className="bg-white rounded-2xl shadow p-4 h-[92vh] overflow-y-auto">
          <Dashboard withoutTitle />
        </div>

        {/* RIGHT: Waiting List */}
        <div className="bg-white rounded-2xl shadow p-4 h-[92vh] overflow-y-auto">
          <WaitingList withoutTitle />
        </div>

      </div>
    </div>
  );
}
