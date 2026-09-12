import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  IndianRupee,
  Loader2,
  PackageCheck,
  Scale,
  XCircle,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import { getBooking } from "../../services/bookings.js";
import {
  submitProcurement,
  updateBookingStatus,
} from "../../services/officer.js";

export default function BookingProcess() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getBooking(id)
      .then((b) => {
        setBooking(b);
        setQuantity(b.quantity ?? "");
      })
      .catch(() => setError("Couldn't load booking."));
  }, [id]);

  async function handleFinalizeProcurement(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await submitProcurement(id, {
        quantity: Number(quantity),
        rate: Number(rate),
      });

      setBooking(await getBooking(id));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't finalize procurement."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Mark this booking as cancelled?")) return;

    setCancelling(true);
    setError("");

    try {
      await updateBookingStatus(id, "CANCELLED");

      setBooking(
        await getBooking(id).catch(() => booking)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't cancel this booking."
      );
    } finally {
      setCancelling(false);
    }
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex bg-[#f6f8f3]">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex bg-[#f6f8f3]">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2
              size={30}
              className="mx-auto animate-spin text-green-700"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading booking...
            </p>
          </div>
        </main>
      </div>
    );
  }

  const isCancelled = booking.status === "CANCELLED";
  const isCompleted = booking.status === "COMPLETED";

  return (
    <div className="min-h-screen flex bg-[#f6f8f3]">
      <Sidebar />

      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5">
          <div className="max-w-6xl mx-auto">
            <button
              type="button"
              onClick={() => navigate("/officer/queue")}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition"
            >
              <ArrowLeft size={17} />
              Back to Today&apos;s Queue
            </button>

            <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                  Booking Process
                </p>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  {booking.booking}
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Process this farmer booking through procurement.
                </p>
              </div>

              <StatusBadge status={booking.status} />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-7">
          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">
              <XCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Action could not be completed
                </p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Booking overview */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Booking Information
                  </p>

                  <h2 className="text-lg font-bold text-gray-900 mt-1">
                    Procurement Details
                  </h2>
                </div>

                <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center">
                  <PackageCheck
                    size={22}
                    className="text-green-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Detail
                  label="Booking"
                  value={booking.booking}
                />

                <Detail
                  label="Crop"
                  value={booking.crop}
                />

                <Detail
                  label="Quantity"
                  value={
                    booking.quantity !== undefined &&
                    booking.quantity !== null
                      ? `${booking.quantity} qtl`
                      : "—"
                  }
                />

                <Detail
                  label="Status"
                  value={formatStatus(booking.status)}
                />
              </div>
            </div>

            <div className="bg-green-700 rounded-3xl p-6 text-white shadow-sm">
              <p className="text-sm text-green-100">
                Current Booking
              </p>

              <p className="text-3xl font-bold mt-2">
                #{id}
              </p>

              <div className="mt-6 pt-5 border-t border-green-600">
                <p className="text-xs text-green-100">
                  Crop
                </p>

                <p className="font-semibold mt-1">
                  {booking.crop || "Not specified"}
                </p>
              </div>
            </div>
          </section>

          {/* Process steps */}
          <section className="mb-6">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Processing Workflow
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-1">
                Complete Booking
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProcessCard
                number="01"
                icon={ClipboardCheck}
                title="Quality Check"
                description="Inspect crop quality and record quality parameters."
                buttonText="Open Quality Check"
                onClick={() =>
                  navigate(
                    `/officer/bookings/${id}/quality`
                  )
                }
                disabled={isCancelled || isCompleted}
              />

              <ProcessCard
                number="02"
                icon={Scale}
                title="Weighment"
                description="Record the final measured quantity at the centre."
                buttonText="Open Weighment"
                onClick={() =>
                  navigate(
                    `/officer/bookings/${id}/weighment`
                  )
                }
                disabled={isCancelled || isCompleted}
              />
            </div>
          </section>

          {/* Finalize procurement */}
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center">
                <PackageCheck
                  size={22}
                  className="text-green-700"
                />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Finalize Procurement
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Enter the final quantity and procurement rate.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleFinalizeProcurement}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Final Quantity
                  </label>

                  <div className="relative">
                    <input
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-16 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                      type="number"
                      min="0"
                      step="0.01"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                      required
                      disabled={isCancelled || isCompleted}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      qtl
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Final quantity received after weighment.
                  </p>
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Procurement Rate
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate}
                      onChange={(e) =>
                        setRate(e.target.value)
                      }
                      placeholder="Enter rate per quintal"
                      required
                      disabled={isCancelled || isCompleted}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Enter the agreed rate in ₹ per quintal.
                  </p>
                </div>
              </div>

              {/* Amount preview */}
              {quantity && rate && (
                <div className="mt-6 rounded-2xl bg-green-50 border border-green-100 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Estimated Procurement Value
                      </p>

                      <p className="text-xs text-green-600 mt-1">
                        Final value based on entered quantity and rate.
                      </p>
                    </div>

                    <p className="text-xl font-bold text-green-800">
                      ₹
                      {(
                        Number(quantity) *
                        Number(rate)
                      ).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {!isCancelled && !isCompleted && (
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60 transition"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Complete Procurement
                      </>
                    )}
                  </button>
                </div>
              )}

              {isCompleted && (
                <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 flex items-center gap-3">
                  <CheckCircle2
                    size={21}
                    className="text-green-700"
                  />

                  <div>
                    <p className="font-semibold text-green-800">
                      Procurement completed
                    </p>

                    <p className="text-sm text-green-700 mt-0.5">
                      This booking has already been completed.
                    </p>
                  </div>
                </div>
              )}

              {isCancelled && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-center gap-3">
                  <XCircle
                    size={21}
                    className="text-red-600"
                  />

                  <div>
                    <p className="font-semibold text-red-800">
                      Booking cancelled
                    </p>

                    <p className="text-sm text-red-700 mt-0.5">
                      No further procurement actions are available.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </section>

          {/* Cancel */}
          {!isCancelled && !isCompleted && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 transition"
              >
                {cancelling ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <XCircle size={16} />
                )}

                {cancelling
                  ? "Cancelling..."
                  : "Cancel this booking"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ProcessCard({
  number,
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  disabled,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition ${
        disabled
          ? "border-gray-200 opacity-60"
          : "border-gray-200 hover:border-green-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
          <Icon
            size={23}
            className="text-green-700"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-green-700">
              STEP {number}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mt-1">
            {title}
          </h3>

          <p className="text-sm text-gray-500 leading-5 mt-1">
            {description}
          </p>

          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="mt-4 rounded-xl border border-green-700 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:cursor-not-allowed transition"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3.5">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
        {value || "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    COMPLETED:
      "bg-green-100 text-green-700 border-green-200",
    CANCELLED:
      "bg-red-100 text-red-700 border-red-200",
    CHECKED_IN:
      "bg-blue-100 text-blue-700 border-blue-200",
    WAITING:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    QUALITY_CHECK:
      "bg-purple-100 text-purple-700 border-purple-200",
    WEIGHMENT:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    PROCUREMENT:
      "bg-green-100 text-green-700 border-green-200",
    BOOKED:
      "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${
        styles[status] ||
        "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
