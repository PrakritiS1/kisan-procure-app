import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Scale,
  Loader2,
  AlertCircle,
  PackageCheck,
} from "lucide-react";

import Sidebar from "../../components/Sidebar.jsx";
import { getBooking } from "../../services/bookings.js";
import { submitWeighment } from "../../services/officer.js";

export default function Weighment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooking(id)
      .then((b) => setExpected(b.quantity))
      .catch(() => setError("Couldn't load booking quantity."));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      await submitWeighment(id, {
        expectedQuantity: Number(expected),
        actualQuantity: Number(actual),
        unit,
      });

      navigate(`/officer/bookings/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't save weighment."
      );
    } finally {
      setSaving(false);
    }
  }

  const difference =
    expected !== "" && actual !== ""
      ? Number(actual) - Number(expected)
      : null;

  return (
    <div className="min-h-screen flex bg-[#f6f8f3]">
      <Sidebar />

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 lg:px-10 py-5">
          <div className="max-w-5xl mx-auto">
            <button
              type="button"
              onClick={() => navigate(`/officer/bookings/${id}`)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700"
            >
              <ArrowLeft size={17} />
              Back to Booking
            </button>

            <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                  Step 2 · Processing
                </p>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                  Weighment
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Record the actual quantity weighed at the centre.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-sm font-bold text-green-700">
                <Scale size={17} />
                Booking #{id}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-7">
          {/* Progress */}
          <div className="grid grid-cols-3 gap-2 mb-7">
            <ProgressStep number="1" label="Quality Check" />
            <ProgressStep number="2" label="Weighment" active />
            <ProgressStep number="3" label="Procurement" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center">
                    <Scale size={22} className="text-green-700" />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Weighment Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Enter the expected and actual weighed quantity.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Expected Quantity
                    </label>

                    <div className="relative">
                      <input
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-20 text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        type="number"
                        min="0"
                        step="0.01"
                        value={expected}
                        onChange={(e) => setExpected(e.target.value)}
                        required
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                        qtl
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Quantity recorded in the farmer booking.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Actual Weighed Quantity
                    </label>

                    <div className="relative">
                      <input
                        className="w-full rounded-xl border border-green-200 bg-green-50/40 px-4 py-3.5 pr-20 text-gray-900 outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                        type="number"
                        min="0"
                        step="0.01"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                        placeholder="Enter actual weight"
                        required
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                        qtl
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Final quantity measured on the weighing scale.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Unit
                  </label>

                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                  />
                </div>

                {difference !== null && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Weight Difference
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Actual quantity minus expected quantity.
                        </p>
                      </div>

                      <p
                        className={`text-xl font-bold ${
                          difference >= 0
                            ? "text-green-700"
                            : "text-orange-600"
                        }`}
                      >
                        {difference >= 0 ? "+" : ""}
                        {difference.toFixed(2)} qtl
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={19} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/officer/bookings/${id}`)}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-7 py-3.5 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Submit Weighment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Side card */}
            <aside className="space-y-5">
              <div className="rounded-3xl bg-green-700 p-6 text-white">
                <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <PackageCheck size={24} />
                </div>

                <h3 className="text-lg font-bold mt-5">
                  Weighment Summary
                </h3>

                <p className="text-sm text-green-100 mt-1">
                  Verify the final quantity before submitting.
                </p>

                <div className="mt-6 space-y-4">
                  <Summary
                    label="Expected"
                    value={
                      expected ? `${expected} qtl` : "—"
                    }
                  />

                  <Summary
                    label="Actual"
                    value={
                      actual ? `${actual} qtl` : "Not entered"
                    }
                  />

                  <Summary
                    label="Unit"
                    value={unit}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-gray-900">
                  Next Step
                </h3>

                <p className="text-sm text-gray-500 leading-6 mt-2">
                  After successful weighment, return to the booking
                  process and continue with procurement.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProgressStep({ number, label, active }) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 flex items-center gap-3 ${
        active
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div
        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
          active
            ? "bg-green-700 text-white"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {number}
      </div>

      <span
        className={`text-xs sm:text-sm font-semibold ${
          active ? "text-green-700" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-green-600/60 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-green-100">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}