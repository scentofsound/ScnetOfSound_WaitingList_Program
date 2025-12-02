// src/admin/components/StatCard.jsx
export default function StatCard({ title, value, highlight }) {
  return (
    <div
      className={`
        p-6 rounded-xl shadow cursor-pointer
        transform transition-all duration-150
        hover:scale-[1.02] active:scale-95

        border-2
        ${highlight 
          ? "border-red-400 hover:bg-red-50" 
          : "border-gray-300 hover:bg-gray-50"
        }
      `}
    >
      <p className="text-gray-500">{title}</p>
      <p className="text-4xl font-bold mt-3">{value}</p>
    </div>
  );
}
