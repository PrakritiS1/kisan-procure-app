import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  MapPin,
  Scale,
  Sprout,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { getBooking, cancelBooking } from "../../services/bookings.js";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // ---------------------------------------------------------
  // LOAD BOOKING
  // ---------------------------------------------------------

  useEffect(() => {
    getBooking(id)
      .then(setBooking)
      .catch(() => setError("Couldn't load booking."));
  }, [id]);

  // ---------------------------------------------------------
  // CANCEL BOOKING
  // ---------------------------------------------------------

  async function handleCancel() {
    const reason = window.prompt(
      "Reason for cancelling this booking?"
    );

    if (!reason) return;

    setCancelling(true);
    setError("");

    try {
      await cancelBooking(id, reason);

      const updatedBooking = await getBooking(id);
      setBooking(updatedBooking);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  }

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-[#f5f8f5]">

        <header className="sticky top-0 z-20 bg-white border-b border-[#dce8df]">
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#eff7f0]"
            >
              <ArrowLeft
                size={21}
                className="text-[#173d20]"
              />
            </button>

            <h1 className="font-bold text-[#173d20]">
              Booking Details
            </h1>

          </div>
        </header>

        <main className="max-w-md mx-auto px-5 py-16 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle
              size={32}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#173d20]">
            Unable to load booking
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-2xl bg-[#0d631b] text-white font-bold"
          >
            Try Again
          </button>

        </main>
      </div>
    );
  }

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f5f8f5]">

        <header className="bg-white border-b border-[#dce8df]">
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />

            <div className="h-5 w-36 rounded bg-gray-100 animate-pulse" />
          </div>
        </header>

        <main className="max-w-md mx-auto px-5 py-20 text-center">

          <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#dce8df] border-t-[#0d631b] animate-spin" />

          <p className="mt-5 text-sm text-gray-500">
            Loading booking details...
          </p>

        </main>
      </div>
    );
  }

  // ---------------------------------------------------------
  // STATUS
  // ---------------------------------------------------------

  const cancellable = ![
    "COMPLETED",
    "CANCELLED",
  ].includes(booking.status);

  const isCancelled =
    booking.status === "CANCELLED";

  const isCompleted =
    booking.status === "COMPLETED";

  const statusText =
    booking.status === "BOOKED"
      ? "Scheduled"
      : booking.status === "CHECKED_IN"
      ? "Checked In"
      : booking.status === "WAITING"
      ? "Waiting in Queue"
      : booking.status === "QUALITY_CHECK"
      ? "Quality Check"
      : booking.status === "WEIGHMENT"
      ? "Weighment"
      : booking.status === "PROCUREMENT"
      ? "Procurement"
      : booking.status === "COMPLETED"
      ? "Completed"
      : booking.status === "CANCELLED"
      ? "Cancelled"
      : booking.status;

  // ---------------------------------------------------------
  // MAIN
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f8f5] pb-12">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 bg-white border-b border-[#dce8df]">

        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#eff7f0] transition"
              aria-label="Go back"
            >
              <ArrowLeft
                size={21}
                className="text-[#173d20]"
              />
            </button>

            <div>
              <p className="text-xs text-gray-400 hidden sm:block">
                KisanProcure
              </p>

              <h1 className="font-bold text-[#173d20]">
                Booking Details
              </h1>
            </div>

          </div>


          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-xl bg-[#0d631b] flex items-center justify-center">
              <Sprout
                size={20}
                className="text-white"
              />
            </div>

            <span className="font-bold text-[#173d20] hidden sm:block">
              AgriConnect
            </span>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-6xl mx-auto px-5 py-7">

        {/* TITLE */}

        <div>

          <p className="text-sm font-bold text-[#0d631b] uppercase tracking-wide">
            My Booking
          </p>

          <h2 className="mt-1 text-3xl md:text-4xl font-bold text-[#12351a]">
            Booking Details
          </h2>

          <p className="mt-2 text-gray-500">
            View all information related to your procurement booking.
          </p>

        </div>


        {/* ===================================================
            BOOKING HERO
        =================================================== */}

        <section className="mt-7 bg-[#0d631b] rounded-3xl p-6 md:p-8 text-white shadow-lg">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-2 text-green-100 text-sm">
                <FileText size={17} />
                Booking ID
              </div>

              <h3 className="mt-2 text-2xl md:text-3xl font-bold break-all">
                {booking.booking || id}
              </h3>

              <p className="mt-2 text-sm text-green-100">
                Your procurement booking information
              </p>

            </div>


            <div
              className={`w-fit px-4 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm ${
                isCancelled
                  ? "bg-red-500/20 text-red-100"
                  : isCompleted
                  ? "bg-white/20 text-white"
                  : "bg-white/20 text-white"
              }`}
            >

              {isCancelled ? (
                <AlertCircle size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}

              {statusText}

            </div>

          </div>

        </section>


        {/* ===================================================
            ERROR AFTER DATA LOADED
        =================================================== */}

        {error && (
          <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex gap-3">

            <AlertCircle
              size={19}
              className="text-red-500 shrink-0"
            />

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>
        )}


        {/* ===================================================
            DETAILS GRID
        =================================================== */}

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <DetailCard
            icon={<Sprout size={22} />}
            label="Crop"
            value={booking.crop || "—"}
          />

          <DetailCard
            icon={<Scale size={22} />}
            label="Expected Quantity"
            value={
              booking.quantity != null
                ? `${booking.quantity} qtl`
                : "—"
            }
          />

          <DetailCard
            icon={<MapPin size={22} />}
            label="Procurement Centre"
            value={
              booking.centreName ||
              (booking.centreId
                ? `Centre #${booking.centreId}`
                : "—")
            }
          />

          <DetailCard
            icon={<Clock3 size={22} />}
            label="Booking Status"
            value={statusText}
          />

        </section>


        {/* ===================================================
            BOOKING INFORMATION
        =================================================== */}

        <section className="mt-6 bg-white rounded-3xl border border-[#dce8df] shadow-sm p-6 md:p-7">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-[#eff7f0] flex items-center justify-center">
              <CalendarDays
                size={22}
                className="text-[#0d631b]"
              />
            </div>

            <div>

              <h3 className="text-lg font-bold text-[#173d20]">
                Booking Information
              </h3>

              <p className="text-sm text-gray-500">
                Details submitted for this procurement request.
              </p>

            </div>

          </div>


          <div className="divide-y divide-[#edf2ee]">

            <InfoRow
              label="Booking ID"
              value={booking.booking || id}
            />

            <InfoRow
              label="Crop"
              value={booking.crop || "—"}
            />

            <InfoRow
              label="Expected Quantity"
              value={
                booking.quantity != null
                  ? `${booking.quantity} quintals`
                  : "—"
              }
            />

            <InfoRow
              label="Centre ID"
              value={
                booking.centreId != null
                  ? `Centre #${booking.centreId}`
                  : "—"
              }
            />

            <InfoRow
              label="Current Status"
              value={statusText}
            />

          </div>

        </section>


        {/* ===================================================
            LIVE STATUS CTA
        =================================================== */}

        {!isCancelled && (
          <section className="mt-6 bg-[#eff4ff] border border-[#dce7fa] rounded-3xl p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                  <Clock3
                    size={23}
                    className="text-[#315ea8]"
                  />
                </div>

                <div>

                  <h3 className="font-bold text-[#243f68]">
                    Track your booking live
                  </h3>

                  <p className="mt-1 text-sm text-[#5d708f]">
                    See your queue position and current procurement stage.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/farmer/bookings/${id}/status`
                  )
                }
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-[#315ea8] text-white font-bold hover:bg-[#274d8c] transition"
              >
                View Live Status
              </button>

            </div>

          </section>
        )}


        {/* ===================================================
            CANCELLED NOTICE
        =================================================== */}

        {isCancelled && (
          <section className="mt-6 bg-red-50 border border-red-200 rounded-3xl p-6">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                <AlertCircle
                  size={23}
                  className="text-red-500"
                />
              </div>

              <div>

                <h3 className="font-bold text-red-700">
                  Booking Cancelled
                </h3>

                <p className="mt-1 text-sm text-red-600">
                  This booking is no longer active and cannot be
                  modified.
                </p>

              </div>

            </div>

          </section>
        )}


        {/* ===================================================
            CANCEL BOOKING
        =================================================== */}

        {cancellable && (
          <section className="mt-6 bg-white rounded-3xl border border-[#eadede] shadow-sm p-6">

            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <Trash2
                  size={21}
                  className="text-red-500"
                />
              </div>

              <div className="flex-1">

                <h3 className="font-bold text-[#173d20]">
                  Cancel this booking?
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Only cancel if you no longer need this procurement
                  slot.
                </p>

              </div>

            </div>


            <button
              type="button"
              disabled={cancelling}
              onClick={handleCancel}
              className="mt-5 w-full h-12 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >

              {cancelling ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Cancelling...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Cancel Booking
                </>
              )}

            </button>

          </section>
        )}


        {/* ===================================================
            COMPLETED NOTICE
        =================================================== */}

        {isCompleted && (
          <section className="mt-6 bg-[#eff7f0] border border-[#cfe4d3] rounded-3xl p-6">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                <ShieldCheck
                  size={25}
                  className="text-[#0d631b]"
                />
              </div>

              <div>

                <h3 className="font-bold text-[#173d20]">
                  Procurement Completed
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  This booking has completed its procurement process.
                </p>

              </div>

            </div>

          </section>
        )}


        {/* ===================================================
            FOOTER
        =================================================== */}

        <p className="text-center text-xs text-gray-400 mt-8">
          AgriConnect • KisanProcure
        </p>

      </main>

    </div>
  );
}


// =========================================================
// DETAIL CARD
// =========================================================

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-3xl border border-[#dce8df] shadow-sm p-5">

      <div className="flex items-start gap-4">

        <div className="w-11 h-11 rounded-2xl bg-[#eff7f0] text-[#0d631b] flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="mt-1 font-bold text-[#173d20] break-words">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// INFO ROW
// =========================================================

function InfoRow({ label, value }) {
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#173d20] sm:text-right">
        {value}
      </span>

    </div>
  );
}