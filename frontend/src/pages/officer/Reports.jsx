import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  FileBarChart,
  Loader2,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "lucide-react";

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

  const summary = data?.summary || {};

  return (
    <div className="min-h-screen flex bg-[#f6f8f3]">
      <Sidebar />

      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                  Officer Analytics
                </p>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  Reports
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Review procurement activity for a selected period.
                </p>
              </div>

              <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                <FileBarChart
                  size={24}
                  className="text-green-700"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7">
          {/* Filter */}
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                <CalendarDays
                  size={20}
                  className="text-green-700"
                />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Report Period
                </h2>

                <p className="text-sm text-gray-500">
                  Choose the date range for your report.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleRun}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  From
                </label>

                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  To
                </label>

                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <BarChart3 size={18} />
                    Run Report
                  </>
                )}
              </button>
            </form>
          </section>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <XCircle size={19} />
              {error}
            </div>
          )}

          {/* Empty state */}
          {!data && !loading && !error && (
            <section className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
                <BarChart3
                  size={27}
                  className="text-green-700"
                />
              </div>

              <h2 className="font-bold text-gray-900 mt-5">
                Generate your report
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Select a date range above to view procurement statistics.
              </p>
            </section>
          )}

          {/* Results */}
          {data && (
            <>
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                  Report Results
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {data.period?.from} → {data.period?.to}
                </h2>
              </div>

              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <ReportCard
                  label="Total Bookings"
                  value={summary.total_bookings ?? 0}
                  icon={FileBarChart}
                />

                <ReportCard
                  label="Completed"
                  value={
                    summary.completed ??
                    summary.completed_bookings ??
                    0
                  }
                  icon={CheckCircle2}
                />

                <ReportCard
                  label="Processing"
                  value={
                    summary.processing ??
                    summary.processing_bookings ??
                    0
                  }
                  icon={TrendingUp}
                />

                <ReportCard
                  label="Cancelled"
                  value={summary.cancelled ?? 0}
                  icon={XCircle}
                />
              </section>

              {/* Main report */}
              <section className="mt-6 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">
                    Procurement Summary
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Summary returned by the existing reports API.
                  </p>
                </div>

                <div className="p-6">
                  <div className="rounded-2xl bg-green-50 border border-green-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Total Bookings
                        </p>

                        <p className="text-xs text-green-600 mt-1">
                          During the selected period
                        </p>
                      </div>

                      <p className="text-4xl font-bold text-green-800">
                        {summary.total_bookings ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 text-xs text-gray-400">
                    Data is loaded directly from the existing officer
                    reports endpoint.
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ReportCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
        </div>

        <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center">
          <Icon
            size={21}
            className="text-green-700"
          />
        </div>
      </div>
    </div>
  );
}