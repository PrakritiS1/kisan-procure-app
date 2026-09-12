import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sprout,
  Users,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import { getDashboard } from "../../services/officer.js";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // ---------------------------------------------------------
  // LOAD DASHBOARD
  // ---------------------------------------------------------

  async function loadDashboard(showLoader = false) {
    if (showLoader) {
      setRefreshing(true);
    }

    try {
      setError("");

      const data = await getDashboard();
      setStats(data);
    } catch (err) {
      console.error("Officer dashboard error:", err);
      setError("Couldn't load dashboard.");
    } finally {
      if (showLoader) {
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  // ---------------------------------------------------------
  // MAIN
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f8f5]">

      <Sidebar />

      <main className="lg:ml-64 min-h-screen">

        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#dce8df]">

          <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#0d631b] flex items-center justify-center">
                <Sprout
                  size={21}
                  className="text-white"
                />
              </div>

              <div>

                <p className="text-xs text-gray-400">
                  AgriConnect
                </p>

                <h1 className="font-bold text-[#173d20]">
                  Officer Dashboard
                </h1>

              </div>

            </div>


            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="h-10 px-4 rounded-xl border border-[#dce8df] bg-white text-[#0d631b] font-semibold flex items-center gap-2 hover:bg-[#eff7f0] transition disabled:opacity-60"
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>

            </button>

          </div>

        </header>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">

          {/* PAGE INTRO */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>

              <p className="text-sm font-bold text-[#0d631b] uppercase tracking-wide">
                Mandi Operations
              </p>

              <h2 className="mt-1 text-3xl md:text-4xl font-bold text-[#12351a]">
                Good day, Officer
              </h2>

              <p className="mt-2 text-gray-500">
                Monitor today's procurement activity and manage the queue.
              </p>

            </div>


            <Link
              to="/officer/queue"
              className="w-full md:w-auto h-12 px-5 rounded-2xl bg-[#0d631b] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#095216] transition"
            >
              Open Today's Queue
              <ArrowRight size={18} />
            </Link>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-3">

              <AlertCircle
                size={19}
                className="text-red-500 shrink-0"
              />

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>
          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {!stats && !error && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-36 bg-white rounded-3xl border border-[#dce8df] animate-pulse"
                  />
                )
              )}

            </div>
          )}


          {/* =================================================
              STAT CARDS
          ================================================= */}

          {stats && (
            <section className="mt-8">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h3 className="text-lg font-bold text-[#173d20]">
                    Today's Overview
                  </h3>

                  <p className="text-sm text-gray-500">
                    Live procurement activity
                  </p>

                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#0d631b]">
                  <span className="w-2 h-2 rounded-full bg-[#0d631b] animate-pulse" />
                  Live
                </div>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

                <StatCard
                  label="Total Bookings"
                  value={stats.totalBookings}
                  icon={<ClipboardList size={23} />}
                  description="Today's bookings"
                />

                <StatCard
                  label="Checked In"
                  value={stats.checkedIn}
                  icon={<Users size={23} />}
                  description="Farmers arrived"
                />

                <StatCard
                  label="Waiting"
                  value={stats.waiting}
                  icon={<Clock3 size={23} />}
                  description="In queue"
                  highlight
                />

                <StatCard
                  label="Processing"
                  value={stats.processing}
                  icon={
                    <Loader2
                      size={23}
                      className="animate-spin"
                    />
                  }
                  description="Currently active"
                />

                <StatCard
                  label="Completed"
                  value={stats.completed}
                  icon={<CheckCircle2 size={23} />}
                  description="Completed today"
                />

              </div>

            </section>
          )}


          {/* =================================================
              OPERATIONS PANEL
          ================================================= */}

          <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* QUEUE ACTION */}

            <div className="lg:col-span-2 bg-[#0d631b] rounded-3xl p-7 text-white shadow-lg">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

                <div>

                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">

                    <Users size={25} />

                  </div>

                  <h3 className="text-2xl font-bold">
                    Manage Today's Queue
                  </h3>

                  <p className="mt-2 text-sm text-green-100 max-w-lg leading-6">
                    View checked-in farmers, call the next farmer,
                    and move bookings through the procurement process.
                  </p>

                </div>


                <Link
                  to="/officer/queue"
                  className="shrink-0 px-6 py-3.5 rounded-2xl bg-white text-[#0d631b] font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition"
                >
                  Open Queue
                  <ArrowRight size={18} />
                </Link>

              </div>

            </div>


            {/* SYSTEM STATUS */}

            <div className="bg-white rounded-3xl border border-[#dce8df] shadow-sm p-6">

              <div className="w-12 h-12 rounded-2xl bg-[#eff7f0] flex items-center justify-center">

                <ShieldCheck
                  size={24}
                  className="text-[#0d631b]"
                />

              </div>

              <h3 className="mt-5 text-lg font-bold text-[#173d20]">
                Operations Status
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Procurement centre system
              </p>


              <div className="mt-6 flex items-center gap-3">

                <span className="w-3 h-3 rounded-full bg-[#0d631b] animate-pulse" />

                <span className="font-semibold text-[#173d20]">
                  System Active
                </span>

              </div>

              <p className="mt-3 text-xs text-gray-400">
                Dashboard data is connected to the live backend.
              </p>

            </div>

          </section>


          {/* =================================================
              QUICK OPERATIONS
          ================================================= */}

          <section className="mt-8">

            <div className="mb-4">

              <h3 className="text-lg font-bold text-[#173d20]">
                Quick Operations
              </h3>

              <p className="text-sm text-gray-500">
                Access frequently used officer functions.
              </p>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              <QuickAction
                to="/officer/queue"
                icon={<Users size={22} />}
                title="Today's Queue"
                description="View and manage farmer bookings"
              />

              <QuickAction
                to="/officer/reports"
                icon={<ClipboardList size={22} />}
                title="Reports"
                description="View procurement reports"
              />

            </div>

          </section>


          {/* =================================================
              FOOTER NOTE
          ================================================= */}

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-400">

            <ShieldCheck size={15} />

            <span>
              AgriConnect • KisanProcure Officer Portal
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  label,
  value,
  icon,
  description,
  highlight = false,
}) {
  return (
    <div
      className={`bg-white rounded-3xl border shadow-sm p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight
          ? "border-[#e5d49d]"
          : "border-[#dce8df]"
      }`}
    >

      <div className="flex items-start justify-between gap-3">

        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
            highlight
              ? "bg-[#fff7df] text-[#a97800]"
              : "bg-[#eff7f0] text-[#0d631b]"
          }`}
        >
          {icon}
        </div>

      </div>


      <p className="mt-5 text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-[#173d20]">
        {value ?? 0}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>

    </div>
  );
}


// =========================================================
// QUICK ACTION
// =========================================================

function QuickAction({
  to,
  icon,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="bg-white rounded-3xl border border-[#dce8df] shadow-sm p-5 flex items-center gap-4 hover:border-[#bcd5c2] hover:shadow-md transition group"
    >

      <div className="w-12 h-12 rounded-2xl bg-[#eff7f0] text-[#0d631b] flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div className="flex-1 min-w-0">

        <h4 className="font-bold text-[#173d20]">
          {title}
        </h4>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>

      </div>

      <ArrowRight
        size={18}
        className="text-gray-300 group-hover:text-[#0d631b] transition"
      />

    </Link>
  );
}