import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Loader2,
  ShieldCheck,
  Sprout,
  AlertCircle,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

import { getBooking } from "../../services/bookings.js";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // LOAD BOOKING
  // ---------------------------------------------------------

  useEffect(() => {
    getBooking(id)
      .then(setBooking)
      .catch(() => setError("Couldn't load booking."));
  }, [id]);

  // ---------------------------------------------------------
  // ERROR
  // ---------------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f8f5]">

        <header className="bg-white border-b border-[#dce8df]">
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
              Payment
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
            Unable to load payment status
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

            <div className="w-24 h-5 rounded bg-gray-100 animate-pulse" />

          </div>
        </header>

        <main className="max-w-md mx-auto px-5 py-20 text-center">

          <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#dce8df] border-t-[#0d631b] animate-spin" />

          <p className="mt-5 text-sm text-gray-500">
            Loading payment status...
          </p>

        </main>
      </div>
    );
  }

  // ---------------------------------------------------------
  // PAYMENT STATUS
  // ---------------------------------------------------------

  const done = booking.status === "COMPLETED";

  const statusText = done
    ? "Payment Processing"
    : "Payment Pending";

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
                Payment
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

      <main className="max-w-5xl mx-auto px-5 py-8">

        {/* ===================================================
            HERO
        =================================================== */}

        <section
          className={`rounded-3xl p-7 md:p-9 text-white shadow-lg ${
            done
              ? "bg-[#0d631b]"
              : "bg-[#315ea8]"
          }`}
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">

            <div>

              <p className="text-sm text-white/75 uppercase tracking-wide font-semibold">
                Payment Status
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-bold">
                {statusText}
              </h2>

              <p className="mt-3 text-sm md:text-base text-white/80 max-w-xl">
                {done
                  ? "Your crop has been successfully procured. The payment process is being handled by the procurement centre."
                  : "Payment will be initiated after weighment and procurement are completed at the centre."}
              </p>

            </div>


            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">

              {done ? (
                <CheckCircle2
                  size={43}
                  className="text-white"
                />
              ) : (
                <Clock3
                  size={43}
                  className="text-white"
                />
              )}

            </div>

          </div>

        </section>


        {/* ===================================================
            STATUS CARD
        =================================================== */}

        <section className="mt-6 bg-white rounded-3xl border border-[#dce8df] shadow-sm p-6">

          <div className="flex items-center gap-4">

            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                done
                  ? "bg-[#eff7f0]"
                  : "bg-[#eff4ff]"
              }`}
            >

              {done ? (
                <CheckCircle2
                  size={24}
                  className="text-[#0d631b]"
                />
              ) : (
                <Clock3
                  size={24}
                  className="text-[#315ea8]"
                />
              )}

            </div>


            <div>

              <p className="text-xs text-gray-500">
                Current Status
              </p>

              <h3 className="text-lg font-bold text-[#173d20]">
                {done
                  ? "Procurement Completed"
                  : "Payment Pending"}
              </h3>

            </div>

          </div>

        </section>


        {/* ===================================================
            PAYMENT JOURNEY
        =================================================== */}

        <section className="mt-6 bg-white rounded-3xl border border-[#dce8df] shadow-sm p-6 md:p-7">

          <div className="flex items-center gap-3 mb-7">

            <div className="w-11 h-11 rounded-2xl bg-[#eff7f0] flex items-center justify-center">

              <CreditCard
                size={22}
                className="text-[#0d631b]"
              />

            </div>

            <div>

              <h3 className="text-lg font-bold text-[#173d20]">
                Payment Journey
              </h3>

              <p className="text-sm text-gray-500">
                Your procurement payment follows these stages.
              </p>

            </div>

          </div>


          <div className="space-y-5">

            <PaymentStep
              number="1"
              title="Crop Weighed"
              description="Your crop quantity is recorded at the centre."
              completed={done}
            />

            <PaymentStep
              number="2"
              title="Procurement Completed"
              description="The procurement transaction is completed."
              completed={done}
            />

            <PaymentStep
              number="3"
              title="Payment Initiated"
              description="Payment is initiated through the centre process."
              completed={done}
              active={!done}
            />

            <PaymentStep
              number="4"
              title="Amount Credited"
              description="The payment is credited to your registered account."
              completed={false}
              active={false}
            />

          </div>

        </section>


        {/* ===================================================
            BOOKING SUMMARY
        =================================================== */}

        <section className="mt-6 bg-white rounded-3xl border border-[#dce8df] shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 rounded-2xl bg-[#eff7f0] flex items-center justify-center">

              <FileText
                size={22}
                className="text-[#0d631b]"
              />

            </div>

            <div>

              <h3 className="text-lg font-bold text-[#173d20]">
                Booking Summary
              </h3>

              <p className="text-sm text-gray-500">
                Details connected to this payment.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <SummaryCard
              icon={<FileText size={19} />}
              label="Booking ID"
              value={booking.booking || id}
            />

            <SummaryCard
              icon={<Sprout size={19} />}
              label="Crop"
              value={booking.crop || "—"}
            />

            <SummaryCard
              icon={<IndianRupee size={19} />}
              label="Quantity"
              value={
                booking.quantity != null
                  ? `${booking.quantity} qtl`
                  : "—"
              }
            />

            <SummaryCard
              icon={<ShieldCheck size={19} />}
              label="Booking Status"
              value={booking.status || "—"}
            />

          </div>

        </section>


        {/* ===================================================
            IMPORTANT NOTE
        =================================================== */}

        <section className="mt-6 bg-[#eff4ff] border border-[#dce7fa] rounded-3xl p-6">

          <div className="flex items-start gap-4">

            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0">

              <ShieldCheck
                size={22}
                className="text-[#315ea8]"
              />

            </div>

            <div>

              <h3 className="font-bold text-[#243f68]">
                Payment Information
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#5d708f]">
                Payment is processed by the procurement centre
                and credited to your registered account after
                completion of the required procurement process.
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="mt-7 flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/farmer/bookings/${id}`
              )
            }
            className="flex-1 h-13 py-3 rounded-2xl border border-[#0d631b] text-[#0d631b] font-bold hover:bg-[#eff7f0] transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Booking Details
          </button>


          <button
            type="button"
            onClick={() => navigate("/farmer")}
            className="flex-1 h-13 py-3 rounded-2xl bg-[#0d631b] text-white font-bold hover:bg-[#095216] transition flex items-center justify-center gap-2"
          >
            Dashboard
            <ArrowRight size={18} />
          </button>

        </div>


        <p className="text-center text-xs text-gray-400 mt-7">
          AgriConnect • KisanProcure
        </p>

      </main>

    </div>
  );
}


// =========================================================
// PAYMENT STEP
// =========================================================

function PaymentStep({
  number,
  title,
  description,
  completed,
  active,
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="relative shrink-0">

        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
            completed
              ? "bg-[#0d631b] text-white"
              : active
              ? "bg-[#e6eefb] text-[#315ea8] border-2 border-[#315ea8]"
              : "bg-[#f1f3f2] text-gray-400"
          }`}
        >

          {completed ? (
            <CheckCircle2 size={18} />
          ) : (
            number
          )}

        </div>

      </div>


      <div className="pt-0.5">

        <p
          className={`font-bold ${
            completed || active
              ? "text-[#173d20]"
              : "text-gray-400"
          }`}
        >
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>

      </div>

    </div>
  );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-[#f8fbf8] border border-[#e2ece4] p-4">

      <div className="flex items-center gap-2 text-[#0d631b]">
        {icon}

        <span className="text-xs text-gray-500">
          {label}
        </span>
      </div>

      <p className="mt-2 font-bold text-[#173d20] break-words">
        {value}
      </p>

    </div>
  );
}