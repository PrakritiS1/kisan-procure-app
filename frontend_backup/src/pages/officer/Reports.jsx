// Reports
import { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import { getReports } from "../../services/officer.js";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function Reports() {
  const [from, setFrom] = useState(todayIso());
  const [to, setTo] = useState(todayIso());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRun(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await getReports(from, to);
      setData(res.data);
    } catch {
      setError("Couldn't load report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-brand-900 mb-6">Reports</h1>
        <form onSubmit={handleRun} className="card flex items-end gap-3 mb-6">
          <div>
            <label className="text-sm text-brand-700">From</label>
            <input className="input-field mt-1" type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-brand-700">To</label>
            <input className="input-field mt-1" type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
          </div>
          <button className="btn-primary w-auto px-6" disabled={loading} type="submit">{loading ? "Running..." : "Run"}</button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {data && (
          <div className="card">
            <p className="text-sm text-brand-500">{data.period.from} to {data.period.to}</p>
            <p className="text-3xl font-bold text-brand-900 mt-2">{data.summary.total_bookings}</p>
            <p className="text-sm text-brand-500">Total Bookings</p>
          </div>
        )}
      </main>
    </div>
  );
}