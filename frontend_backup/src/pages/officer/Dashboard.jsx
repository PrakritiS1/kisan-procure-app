// Officer dashboard
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, Loader2, CheckCircle2, ListOrdered } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import StatsCard from "../../components/StatsCard.jsx";
import { getDashboard } from "../../services/officer.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboard().then(setStats).catch(() => setError("Couldn't load dashboard."));
  }, []);

  return (
    <div className="min-h-screen flex bg-brand-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-6">Officer Dashboard</h1>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatsCard label="Total Bookings" value={stats.totalBookings} icon={<ListOrdered size={20} />} />
            <StatsCard label="Checked In" value={stats.checkedIn} icon={<Users size={20} />} />
            <StatsCard label="Waiting" value={stats.waiting} icon={<Clock size={20} />} accent="gold" />
            <StatsCard label="Processing" value={stats.processing} icon={<Loader2 size={20} />} />
            <StatsCard label="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} />
          </div>
        )}
        <Link to="/officer/queue" className="btn-primary inline-block w-auto px-6 mt-8">Open Today's Queue</Link>
      </main>
    </div>
  );
}