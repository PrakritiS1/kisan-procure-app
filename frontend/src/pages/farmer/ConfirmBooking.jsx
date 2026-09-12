import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Scale,
  MapPin,
  Wheat,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";

import { createBooking } from "../../services/bookings.js";
import { useBooking } from "../../context/BookingContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ConfirmBooking() {
  const navigate = useNavigate();

  const { draft, setLastBooking } = useBooking();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");

    try {
      const res = await createBooking({
        cropId: draft.cropId,
        quantity: Number(draft.quantity),
        centreId: draft.centreId,
        slotId: draft.slotId,
      });

      setLastBooking(res.booking);

      navigate(
        `/farmer/bookings/${res.booking.id}/confirmed`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Couldn't confirm booking. The slot may have just filled up."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#12351a] pb-32">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dce8de]">

        <div className="max-w-4xl mx-auto px-5 lg:px-8 h-20 flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="w-11 h-11 rounded-xl border border-[#dce8de] flex items-center justify-center hover:bg-[#f1f7f2]"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <p className="text-xs text-gray-500">
              Final Step
            </p>

            <h1 className="font-extrabold text-xl">
              Confirm Booking
            </h1>
          </div>

        </div>

      </header>


      <main className="max-w-4xl mx-auto px-5 lg:px-8 py-7">

        {/* ================= TITLE ================= */}
        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-[#dff2e1] flex items-center justify-center">

              <CheckCircle2
                size={27}
                className="text-[#0d631b]"
              />

            </div>

            <div>

              <h2 className="text-2xl font-extrabold">
                Review your booking
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                कृपया बुकिंग की जानकारी जाँच लें
              </p>

            </div>

          </div>

        </div>


        {/* ================= CENTRE CARD ================= */}
        <section className="bg-white rounded-3xl border border-[#dce8de] shadow-sm overflow-hidden">

          <div className="bg-gradient-to-r from-[#0d631b] to-[#187728] px-5 md:px-7 py-6 text-white">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-wider text-green-100 font-bold">
                  Procurement Centre
                </p>

                <h3 className="text-2xl font-extrabold mt-1">
                  {draft.centreName || "Selected Centre"}
                </h3>

              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">

                <MapPin size={25} />

              </div>

            </div>

          </div>


          <div className="p-5 md:p-7">

            {/* CROP */}
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100">

              <div className="w-14 h-14 rounded-2xl bg-[#eff8ef] flex items-center justify-center">

                <Wheat
                  size={27}
                  className="text-[#0d631b]"
                />

              </div>

              <div>

                <p className="text-xs text-gray-500 font-semibold">
                  Crop
                </p>

                <p className="text-xl font-extrabold mt-1">
                  {draft.cropName || "—"}
                </p>

              </div>

            </div>


            {/* DETAILS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-5">

              <DetailCard
                icon={CalendarDays}
                label="Date"
                value={
                  draft.date
                    ? formatDate(draft.date)
                    : "—"
                }
              />

              <DetailCard
                icon={Clock3}
                label="Time Slot"
                value={draft.slotLabel || "—"}
              />

              <DetailCard
                icon={Scale}
                label="Expected Quantity"
                value={`${draft.quantity || 0} qtl`}
              />

              <DetailCard
                icon={MapPin}
                label="Distance"
                value={
                  draft.distanceKm != null
                    ? `${draft.distanceKm.toFixed(1)} km`
                    : "—"
                }
              />

            </div>

          </div>

        </section>


        {/* ================= BOOKING SUMMARY ================= */}
        <section className="mt-6">

          <h2 className="text-xl font-extrabold mb-4">
            Booking Summary
          </h2>

          <div className="bg-white border border-[#dce8de] rounded-3xl overflow-hidden">

            <SummaryRow
              label="Crop"
              value={draft.cropName || "—"}
            />

            <SummaryRow
              label="Quantity"
              value={`${draft.quantity || 0} qtl`}
            />

            <SummaryRow
              label="Date"
              value={
                draft.date
                  ? formatDate(draft.date)
                  : "—"
              }
            />

            <SummaryRow
              label="Time"
              value={draft.slotLabel || "—"}
            />

            <SummaryRow
              label="Centre"
              value={draft.centreName || "—"}
              last
            />

          </div>

        </section>


        {/* ================= IMPORTANT NOTICE ================= */}
        <section className="mt-6 bg-[#fff8e8] border border-[#f0d99b] rounded-3xl p-5">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-xl bg-[#ffeab2] flex items-center justify-center shrink-0">

              <Info
                size={22}
                className="text-[#9a6500]"
              />

            </div>

            <div>

              <h3 className="font-extrabold text-[#704b00]">
                Before you confirm
              </h3>

              <p className="text-sm text-[#80632b] mt-2 leading-6">
                Your selected capacity will be reserved after
                confirmation. Please bring approximately the
                declared quantity to the procurement centre.
              </p>

            </div>

          </div>

        </section>


        {/* ================= TRUST ================= */}
        <section className="mt-5 bg-[#eff4ff] border border-[#d7e1f3] rounded-3xl p-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">

              <ShieldCheck
                size={23}
                className="text-[#0d631b]"
              />

            </div>

            <div>

              <p className="font-extrabold">
                Secure digital booking
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Your booking will be registered securely with
                the procurement system.
              </p>

            </div>

          </div>

        </section>


        {/* ================= ERROR ================= */}
        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-4">

            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

          </div>
        )}

      </main>


      {/* ================= BOTTOM CTA ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-[#dce8de]">

        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-4">

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-extrabold flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {loading
              ? "Confirming Booking..."
              : "Confirm Booking"}

            {!loading && (
              <ArrowRight size={21} />
            )}

          </button>

        </div>

      </div>

    </div>
  );
}


/* ================= DETAIL CARD ================= */

function DetailCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-[#f7faf7] border border-[#e1ebe2] rounded-2xl p-4">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">

          <Icon
            size={19}
            className="text-[#0d631b]"
          />

        </div>

        <div className="min-w-0">

          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="font-bold mt-1 truncate">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


/* ================= SUMMARY ROW ================= */

function SummaryRow({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 ${!last
          ? "border-b border-gray-100"
          : ""
        }`}
    >

      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-sm font-bold text-right">
        {value}
      </span>

    </div>
  );
}