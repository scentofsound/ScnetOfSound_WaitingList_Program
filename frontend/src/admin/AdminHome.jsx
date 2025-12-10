// src/admin/AdminHome.jsx
import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import WaitingList from "./WaitingList";

export default function AdminHome() {
  const { serviceName = "perfume" } = useParams();

  const SERVICE_LABEL = {
    perfume: "Perfume",
    air_freshener: "Air Freshener",
  };

  const label = SERVICE_LABEL[serviceName] || serviceName;

  return (
    <div className="w-screen h-screen p-6 bg-gray-50 overflow-auto">
      <h1 className="text-4xl font-bold mb-6">
        Admin Panel – {label}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 h-[92vh] overflow-y-auto">
          <Dashboard withoutTitle serviceName={serviceName} />
        </div>

        <div className="bg-white rounded-2xl shadow p-4 h-[92vh] overflow-y-auto">
          <WaitingList withoutTitle serviceName={serviceName} />
        </div>
      </div>
    </div>
  );
}
