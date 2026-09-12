import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Wheat,
  Scale,
  ArrowRight,
} from "lucide-react";

import { getCentreSlots } from "../../services/centres.js";
import { useBooking } from "../../context/BookingContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Slots() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { draft, updateDraft } = useBooking();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(
    draft.slotId || null
  );

  useEffect(() => {
    if (!draft.date || !draft.cropId) {
      setError(
        "Missing crop/date — go back and start from Select Crop."
      );
      setLoading(false);
      return;
    }

    getCentreSlots(id, {
      date: draft.date,
      cropId: draft.cropId,
      quantity: draft.quantity,
    })
      .then((res) => setSlots(res.slots))
      .catch(() => setError("Couldn't load time slots."))
      .finally(() => setLoading(false));
  }, [id, draft.date, draft.cropId, draft.quantity]);

  const selected = slots.find(
    (s) => s.id === selectedId
  );

  const fits =
    selected &&
    selected.availableCapacity >= Number(draft.quantity);

  function handleBook() {
    if (!selected || !fits) return;

    updateDraft({
      slotId: selected.id,
      slotLabel: `${selected.startTime} – ${selected.endTime}`,
    });

    navigate("/farmer/confirm");
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#12351a] pb-36">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dce8de]">

        <div className="max-w-5xl mx-auto px-5 lg:px-8 h-20 flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-xl border border-[#dce8de] flex items-center justify-center hover:bg-[#f1f7f2]"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <p className="text-xs text-gray-500">
              Step 4
            </p>

            <h1 className="font-extrabold text-xl">
              Available Time Slots
            </h1>
          </div>

        </div>

      </header>


      <main className="max-w-5xl mx-auto px-5 lg:px-8 py-6">

        {/* ================= BOOKING SUMMARY ================= */}
        <section className="bg-white border border-[#dce8de] rounded-3xl p-5 md:p-6 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>

              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                Select your preferred slot
              </p>

              <h2 className="text-2xl font-extrabold mt-1">
                {draft.cropName || "Selected Crop"}
              </h2>

            </div>


            <div className="flex flex-wrap gap-3">

              <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2.5 rounded-xl">

                <CalendarDays
                  size={18}
                  className="text-[#0d631b]"
                />

                <span className="text-sm font-bold">
                  {draft.date
                    ? formatDate(draft.date)
                    : "Date not selected"}
                </span>

              </div>


              <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2.5 rounded-xl">

                <Scale
                  size={18}
                  className="text-[#0d631b]"
                />

                <span className="text-sm font-bold">
                  {draft.quantity || 0} qtl
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================= SLOT TITLE ================= */}
        <section className="mt-7">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-extrabold">
                Choose a Time
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Available slots for your requirement
              </p>

            </div>

            <Clock3
              size={23}
              className="text-[#0d631b]"
            />

          </div>


          {/* ================= LOADING ================= */}
          {loading && (
            <div className="space-y-3">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-[#dce8de] rounded-2xl p-5 animate-pulse"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-xl bg-gray-200" />

                      <div>
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-100 rounded mt-2" />
                      </div>

                    </div>

                    <div className="h-6 w-20 bg-gray-100 rounded-full" />

                  </div>

                </div>
              ))}

            </div>
          )}


          {/* ================= ERROR ================= */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">

              <AlertCircle
                size={22}
                className="text-red-500 shrink-0"
              />

              <div>

                <p className="font-bold text-red-700">
                  Unable to load slots
                </p>

                <p className="text-sm text-red-600 mt-1">
                  {error}
                </p>

              </div>

            </div>
          )}


          {/* ================= SLOTS ================= */}
          {!loading &&
            !error &&
            slots.length > 0 && (

              <div className="space-y-3">

                {slots.map((slot) => {

                  const full =
                    slot.availableCapacity <= 0 ||
                    slot.status === "FULL";

                  const fitsQuantity =
                    slot.availableCapacity >=
                    Number(draft.quantity);

                  const selectedSlot =
                    selectedId === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={full}
                      onClick={() =>
                        !full && setSelectedId(slot.id)
                      }
                      className={`w-full text-left rounded-2xl border-2 p-5 transition ${
                        full
                          ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                          : selectedSlot
                          ? "bg-[#eff8ef] border-[#0d631b] shadow-sm"
                          : "bg-white border-[#dce8de] hover:border-[#b5d1b9] hover:shadow-sm"
                      }`}
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-4">

                          {/* RADIO */}
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              selectedSlot
                                ? "border-[#0d631b]"
                                : "border-gray-300"
                            }`}
                          >

                            {selectedSlot && (
                              <div className="w-3 h-3 rounded-full bg-[#0d631b]" />
                            )}

                          </div>


                          {/* TIME */}
                          <div>

                            <div className="flex items-center gap-2">

                              <Clock3
                                size={20}
                                className={
                                  selectedSlot
                                    ? "text-[#0d631b]"
                                    : "text-gray-500"
                                }
                              />

                              <p className="text-lg font-extrabold">
                                {slot.startTime}
                                {" – "}
                                {slot.endTime}
                              </p>

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              Mandi processing window
                            </p>

                          </div>

                        </div>


                        {/* CAPACITY */}
                        <div className="text-right">

                          {full ? (

                            <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold">
                              <AlertCircle size={14} />
                              Full
                            </span>

                          ) : (

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                fitsQuantity
                                  ? "bg-[#dff4e2] text-[#0d631b]"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <CheckCircle2 size={14} />
                              {slot.availableCapacity} qtl
                            </span>

                          )}

                          {!full && (
                            <p className="text-xs text-gray-400 mt-2">
                              capacity available
                            </p>
                          )}

                        </div>

                      </div>


                      {/* SELECTED INFO */}
                      {selectedSlot && !full && (
                        <div className="mt-4 pt-4 border-t border-[#cfe3d4] flex items-center gap-2 text-sm text-[#0d631b] font-semibold">

                          <CheckCircle2 size={17} />

                          Slot selected

                        </div>
                      )}

                    </button>
                  );
                })}

              </div>
            )}


          {/* ================= EMPTY ================= */}
          {!loading &&
            !error &&
            slots.length === 0 && (

              <div className="bg-white border border-[#dce8de] rounded-3xl p-10 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eef5ef] flex items-center justify-center">

                  <Clock3
                    size={31}
                    className="text-[#0d631b]"
                  />

                </div>

                <h3 className="font-extrabold text-lg mt-4">
                  No slots available
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  There are no available time slots for your
                  selected crop and quantity.
                </p>

                <button
                  onClick={() => navigate(-1)}
                  className="mt-5 px-5 py-3 rounded-xl bg-[#0d631b] text-white font-bold"
                >
                  Choose Another Centre
                </button>

              </div>
            )}

        </section>


        {/* ================= REQUIREMENT CARD ================= */}
        {selected && (
          <section className="mt-6 bg-white border border-[#dce8de] rounded-3xl p-5">

            <div className="flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-[#e8f5ea] flex items-center justify-center">

                <Wheat
                  size={24}
                  className="text-[#0d631b]"
                />

              </div>

              <div className="flex-1">

                <p className="text-xs font-bold text-gray-500 uppercase">
                  Your Requirement
                </p>

                <p className="font-extrabold text-lg mt-1">
                  {draft.quantity} qtl
                </p>

                <p
                  className={`text-sm mt-1 ${
                    fits
                      ? "text-[#0d631b]"
                      : "text-red-600"
                  }`}
                >
                  {fits
                    ? "This slot can accommodate your full quantity."
                    : "This slot may not fit your full quantity."}
                </p>

              </div>

            </div>

          </section>
        )}

      </main>


      {/* ================= BOTTOM CTA ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-[#dce8de]">

        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-4">

          <button
            disabled={!selected || !fits}
            onClick={handleBook}
            className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-extrabold flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >

            {selected && fits
              ? "Continue to Booking"
              : "Select an Available Slot"}

            <ArrowRight size={21} />

          </button>

        </div>

      </div>

    </div>
  );
}