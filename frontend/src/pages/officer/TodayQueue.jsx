import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListOrdered,
  Loader2,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react";

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
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  async function refresh(showLoader = false) {
    if (showLoader) setRefreshing(true);

    try {
      setError("");
      setData(await getTodayQueue());
    } catch {
      setError("Couldn't load today's queue.");
    } finally {
      if (showLoader) setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCallNext() {
    if (!officer?.centreId) {
      setError("No centre linked to this officer account.");
      return;
    }

    setCalling(true);
    setError("");

    try {
      await callNext(officer.centreId);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || "No one left to call.");
    } finally {
      setCalling(false);
    }
  }

  const queue = data?.queue || [];

  const filteredQueue = queue.filter((item) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      String(item.tokenNumber || "").toLowerCase().includes(query) ||
      String(item.farmerName || "").toLowerCase().includes(query) ||
      String(item.bookingId || "").toLowerCase().includes(query) ||
      String(item.crop || "").toLowerCase().includes(query) ||
      String(item.status || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex bg-[#f6f8f3]">
      <Sidebar />

      <main className="flex-1 min-w-0">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                <span>Officer Portal</span>
                <span>/</span>
                <span className="text-green-700">Today's Queue</span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Today&apos;s Queue
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage farmer arrivals and process bookings efficiently.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refresh(true)}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={handleCallNext}
                disabled={calling}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 disabled:opacity-60 transition"
              >
                {calling ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Calling...
                  </>
                ) : (
                  <>
                    <Users size={17} />
                    Call Next
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7">
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
              <XCircle size={19} className="mt-0.5 shrink-0" />

              <div className="flex-1">
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-0.5">{error}</p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {data && (
            <>
              {/* Stats */}
              <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
                <QueueStat
                  label="Total Bookings"
                  value={data.totalBookings}
                  icon={ListOrdered}
                  description="Today's bookings"
                />

                <QueueStat
                  label="Waiting"
                  value={data.waiting}
                  icon={Clock3}
                  description="Awaiting processing"
                />

                <QueueStat
                  label="Checked In"
                  value={data.checkedIn}
                  icon={Users}
                  description="Farmers arrived"
                />

                <QueueStat
                  label="Completed"
                  value={data.completed}
                  icon={CheckCircle2}
                  description="Successfully processed"
                />
              </section>

              {/* Queue section */}
              <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 lg:px-7 py-5 border-b border-gray-100">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">
                          Farmer Queue
                        </h2>

                        <span className="rounded-full bg-green-100 text-green-700 px-2.5 py-1 text-xs font-bold">
                          {queue.length}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        Select a booking to continue its procurement process.
                      </p>
                    </div>

                    <div className="relative w-full lg:w-80">
                      <Search
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search farmer, token, crop..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Queue list */}
                <div className="p-4 lg:p-6">
                  {filteredQueue.length > 0 ? (
                    <div className="space-y-3">
                      {filteredQueue.map((item) => (
                        <QueueCard
                          key={item.id}
                          item={item}
                          onClick={() =>
                            navigate(`/officer/bookings/${item.id}`)
                          }
                        />
                      ))}
                    </div>
                  ) : search ? (
                    <div className="py-14 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search size={21} className="text-gray-400" />
                      </div>

                      <h3 className="font-semibold text-gray-900">
                        No matching bookings
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Try searching with another farmer name, token or crop.
                      </p>
                    </div>
                  ) : (
                    <div className="py-14 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2 size={23} className="text-green-600" />
                      </div>

                      <h3 className="font-semibold text-gray-900">
                        No bookings for today
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        The queue is currently empty.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Bottom information */}
              <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <InfoCard
                  title="Queue Workflow"
                  text="Call the next farmer, open their booking, and continue through quality check, weighment and procurement."
                />

                <InfoCard
                  title="Live Queue"
                  text="The queue information is loaded directly from your existing officer API."
                />

                <InfoCard
                  title="Centre"
                  text={
                    officer?.centreId
                      ? `Linked Centre ID: ${officer.centreId}`
                      : "No centre linked to this officer."
                  }
                />
              </section>
            </>
          )}

          {!data && !error && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <Loader2
                  size={30}
                  className="mx-auto animate-spin text-green-700"
                />
                <p className="mt-3 text-sm text-gray-500">
                  Loading today&apos;s queue...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function QueueStat({ label, value, icon: Icon, description }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value ?? 0}
          </p>

          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>

        <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center">
          <Icon size={21} className="text-green-700" />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{title}</h3>

        <ArrowRight size={17} className="text-gray-400" />
      </div>

      <p className="text-sm leading-6 text-gray-500 mt-2">{text}</p>
    </div>
  );
}