import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  CalendarPlus,
  ArrowRight,
  Clock3,
  Scale,
  Hash,
  ShieldCheck,
  ChevronLeft,
  Sprout,
  FileText,
} from "lucide-react";

import { getBooking } from "../../services/bookings.js";

function downloadIcs(booking) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KisanProcure//Booking//EN",
    "BEGIN:VEVENT",
    `SUMMARY:KisanProcure - ${booking.crop} booking at Centre #${booking.centreId}`,
    `DESCRIPTION:Booking ${booking.booking}, Token ${booking.tokenNumber}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], {
    type: "text/calendar",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `kisanprocure-${booking.booking}.ics`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export default function BookingConfirmed() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getBooking(id)
      .then((data) => {
        if (active) {
          setBooking(data);
        }
      })
      .catch(() => {
        if (active) {
          setError("Couldn't load booking.");
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f8f5]">
        <header className="sticky top-0 z-20 bg-white border-b border-[#dce8df]">
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#eff6f0]"
              aria-label="Go back"
            >
              <ChevronLeft
                size={22}
                className="text-[#173d20]"
              />
            </button>

            <h1 className="font-bold text-[#173d20]">
              Booking Confirmed
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-5 py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <FileText className="text-red-500" size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#173d20]">
            Booking couldn't be loaded
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/farmer")}
            className="mt-6 h-12 px-6 rounded-2xl bg-[#0d631b] text-white font-bold"
          >
            Go to Dashboard
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
        <header className="sticky top-0 z-20 bg-white border-b border-[#dce8df]">
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center">
            <h1 className="font-bold text-[#173d20]">
              Booking Confirmed
            </h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#dce8df] border-t-[#0d631b] animate-spin" />

          <p className="mt-5 text-sm text-gray-500">
            Loading your booking...
          </p>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN SCREEN
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f8f5] pb-28">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-20 bg-white border-b border-[#dce8df]">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">

          <button
            type="button"
            onClick={() => navigate("/farmer")}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#eff6f0] transition"
            aria-label="Go to dashboard"
          >
            <ChevronLeft
              size={22}
              className="text-[#173d20]"
            />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0d631b] flex items-center justify-center">
              <Sprout
                size={20}
                className="text-white"
              />
            </div>

            <span className="font-bold text-[#173d20]">
              AgriConnect
            </span>
          </div>

          <div className="w-10" />
        </div>
      </header>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="max-w-5xl mx-auto px-5 py-8">

        {/* SUCCESS HERO */}

        <section className="text-center">

          <div className="relative inline-flex">

            <div className="w-24 h-24 rounded-full bg-[#dff2e2] flex items-center justify-center">
              <CheckCircle2
                size={58}
                strokeWidth={2}
                className="text-[#0d631b]"
              />
            </div>

            <div className="absolute -right-1 -bottom-1 w-8 h-8 rounded-full bg-[#0d631b] border-4 border-[#f5f8f5] flex items-center justify-center">
              <CheckCircle2
                size={16}
                className="text-white"
              />
            </div>

          </div>

          <p className="mt-5 text-sm font-bold tracking-wider text-[#0d631b] uppercase">
            Booking successful
          </p>

          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-[#12351a]">
            Your Slot is Confirmed!
          </h1>

          <p className="mt-2 text-gray-500">
            Your procurement capacity has been reserved successfully.
          </p>

        </section>


        {/* ===================================================
            BOOKING ID CARD
        =================================================== */}

        <section className="mt-8 bg-[#0d631b] rounded-3xl p-6 md:p-7 text-white shadow-lg">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-green-100">
                Booking ID
              </p>

              <p className="mt-1 text-2xl font-bold tracking-wide">
                {booking.booking}
              </p>

              <p className="mt-2 text-sm text-green-100">
                Keep this ID for future reference.
              </p>
            </div>

            <div className="self-start md:self-center px-4 py-2 rounded-xl bg-white/15 border border-white/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} />

                <span className="text-sm font-bold">
                  {booking.status || "CONFIRMED"}
                </span>
              </div>
            </div>

          </div>

        </section>


        {/* ===================================================
            BOOKING DETAILS
        =================================================== */}

        <section className="mt-6 bg-white rounded-3xl border border-[#dce8df] shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#173d20]">
              Booking Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your procurement appointment information
            </p>
          </div>


          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CENTRE */}

            <DetailCard
              icon={<MapPin size={20} />}
              label="Procurement Centre"
              value={`Centre #${booking.centreId}`}
            />


            {/* CROP */}

            <DetailCard
              icon={<Sprout size={20} />}
              label="Crop"
              value={booking.crop || "—"}
            />


            {/* QUANTITY */}

            <DetailCard
              icon={<Scale size={20} />}
              label="Expected Quantity"
              value={`${booking.quantity} qtl`}
            />


            {/* TOKEN */}

            <DetailCard
              icon={<Hash size={20} />}
              label="Token Number"
              value={
                booking.tokenNumber
                  ? `#${booking.tokenNumber}`
                  : "Assigned at centre"
              }
            />

          </div>

        </section>


        {/* ===================================================
            TOKEN HIGHLIGHT
        =================================================== */}

        {booking.tokenNumber && (
          <section className="mt-6 bg-[#eff4ff] border border-[#d9e5fa] rounded-3xl p-6">

            <div className="flex flex-col md:flex-row md:items-center gap-5">

              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <Hash
                  size={30}
                  className="text-[#315ea8]"
                />
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#315ea8]">
                  Your Mandi Token
                </p>

                <p className="text-3xl font-bold text-[#173d20] mt-1">
                  #{booking.tokenNumber}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Keep this token ready when you arrive.
                </p>
              </div>

            </div>

          </section>
        )}


        {/* ===================================================
            ACTION BUTTONS
        =================================================== */}

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <button
            type="button"
            onClick={() => navigate(`/farmer/bookings/${id}/status`)}
            className="h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-bold flex items-center justify-center gap-2 transition"
          >
            <Clock3 size={20} />
            Track Live Status
            <ArrowRight size={19} />
          </button>


          <button
            type="button"
            onClick={() => downloadIcs(booking)}
            className="h-14 rounded-2xl border-2 border-[#0d631b] text-[#0d631b] bg-white hover:bg-[#eff7f0] font-bold flex items-center justify-center gap-2 transition"
          >
            <CalendarPlus size={20} />
            Add to Calendar
          </button>

        </section>


        {/* ===================================================
            IMPORTANT INSTRUCTIONS
        =================================================== */}

        <section className="mt-8 bg-white rounded-3xl border border-[#dce8df] p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-[#eff7f0] flex items-center justify-center">
              <ShieldCheck
                size={21}
                className="text-[#0d631b]"
              />
            </div>

            <div>
              <h2 className="font-bold text-[#173d20]">
                Important Instructions
              </h2>

              <p className="text-xs text-gray-500">
                Please keep these points in mind
              </p>
            </div>

          </div>


          <div className="space-y-4">

            <Instruction
              number="01"
              text="Bring your registered ID and required land records."
            />

            <Instruction
              number="02"
              text="Arrive at the procurement centre within your selected time window."
            />

            <Instruction
              number="03"
              text="Bring approximately the quantity declared during booking."
            />

            <Instruction
              number="04"
              text="Follow the instructions provided by the centre staff."
            />

          </div>

        </section>


        {/* ===================================================
            SUPPORT MESSAGE
        =================================================== */}

        <div className="mt-6 text-center">

          <p className="text-xs text-gray-400">
            Your booking information is securely connected to your KisanProcure account.
          </p>

        </div>

      </main>


      {/* =====================================================
          MOBILE / BOTTOM CTA
      ===================================================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#dce8df] px-5 py-4 z-30">

        <div className="max-w-5xl mx-auto">

          <button
            type="button"
            onClick={() => navigate(`/farmer/bookings/${id}/status`)}
            className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-bold flex items-center justify-center gap-2 transition"
          >
            Track Live Status
            <ArrowRight size={19} />
          </button>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// DETAIL CARD
// =========================================================

function DetailCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-[#f8fbf8] border border-[#e2ece4] p-4">

      <div className="flex items-start gap-3">

        <div className="w-10 h-10 rounded-xl bg-[#e5f3e7] text-[#0d631b] flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500">
            {label}
          </p>

          <p className="text-sm font-bold text-[#173d20] mt-1 break-words">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
}


// =========================================================
// INSTRUCTION
// =========================================================

function Instruction({ number, text }) {
  return (
    <div className="flex gap-3">

      <div className="w-8 h-8 rounded-lg bg-[#eff7f0] text-[#0d631b] flex items-center justify-center text-xs font-bold shrink-0">
        {number}
      </div>

      <p className="text-sm text-gray-600 leading-6 pt-1">
        {text}
      </p>

    </div>
  );
}