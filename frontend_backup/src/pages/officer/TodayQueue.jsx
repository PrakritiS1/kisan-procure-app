// Today queue
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import QueueCard from "../../components/QueueCard.jsx";
import { getTodayQueue, callNext } from "../../services/officer.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function TodayQueue() {
  const navigate = useNavigate();
  const { officer } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [calling, setCalling] = useState(false);

  async function refresh() {
    try {
      setData(await getTodayQueue());
    } catch {
      setError("Couldn't load today's queue.");
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleCallNext() {
    if (!officer?.centreId) {
      setError("No centre linked to this officer account.");
      return;
    }
    setCalling(true);
    try {
      await callNext(officer.centreId);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "No one left to call.");
    } finally {
      setCalling(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-brand-900">Today's Queue</h1>
          <button className="btn-primary w-auto px-6" disabled={calling} onClick={handleCallNext}>
            {calling ? "Calling..." : "Call Next"}
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        {data && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Stat label="Total" value={data.totalBookings} />
            <Stat label="Waiting" value={data.waiting} />
            <Stat label="Checked In" value={data.checkedIn} />
            <Stat label="Completed" value={data.completed} />
          </div>
        )}

        <div className="space-y-2 max-w-2xl">
          {data?.queue.map((item) => (
            <QueueCard key={item.id} item={item} onClick={() => navigate(`/officer/bookings/${item.id}`)} />
          ))}
          {data && data.queue.length === 0 && <p className="text-sm text-brand-400">No bookings for today.</p>}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-xl font-bold text-brand-900">{value}</p>
      <p className="text-xs text-brand-500">{label}</p>
    </div>
  );
}