import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Scale,
  Warehouse,
  Droplet,
  Users,
  CheckCircle2,
  Navigation,
  Wheat,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { getCentreDetails, getCentreCapacity } from "../../services/centres.js";
import { useBooking } from "../../context/BookingContext.jsx";

const FACILITY_ICONS = {
  weighbridge: Scale,
  storage: Warehouse,
  "storage available": Warehouse,
  "drinking water": Droplet,
  water: Droplet,
  "waiting area": Users,
};

export default function CentreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { draft, updateDraft } = useBooking();

  const [centre, setCentre] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getCentreDetails(id, {
        latitude: draft.latitude || 0,
        longitude: draft.longitude || 0,
      }),
      getCentreCapacity(id),
    ])
      .then(([c, cap]) => {
        setCentre(c);
        setCapacity(cap);

        updateDraft({
          centreId: Number(id),
          centreName: c.name,
          distanceKm: c.distanceKm,
        });
      })
      .catch(() => {
        setError("Couldn't load centre details.");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f8f5] flex items-center justify-center px-5">
        <div className="bg-white border border-red-200 rounded-2xl p-6 max-w-md w-full">
          <p className="font-bold text-red-700">
            Unable to load centre
          </p>
          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 w-full h-12 rounded-xl bg-[#0d631b] text-white font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!centre || !capacity) {
    return (
      <div className="min-h-screen bg-[#f5f8f5]">

        <header className="bg-white border-b border-[#dce8de] h-20 flex items-center px-5">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-xl border border-[#dce8de] flex items-center justify-center"
            >
              <ArrowLeft size={22} />
            </button>

            <h1 className="font-extrabold text-xl">
              Centre Details
            </h1>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-5 py-10">
          <div className="bg-white rounded-3xl border border-[#dce8de] p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e8f5ea] animate-pulse" />

            <p className="mt-4 text-sm text-gray-500">
              Loading centre...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const remaining = Number(capacity.remainingCapacity || 0);
  const total = Number(capacity.totalCapacity || 0);

  const capacityPercent =
    total > 0
      ? Math.min(100, Math.max(0, (remaining / total) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#12351a] pb-32">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dce8de]">

        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-xl border border-[#dce8de] flex items-center justify-center hover:bg-[#f1f7f2]"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <p className="text-xs text-gray-500">
              Procurement
            </p>

            <h1 className="font-extrabold text-xl">
              Centre Details
            </h1>
          </div>

        </div>
      </header>


      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-6">

        {/* ================= CENTRE HERO ================= */}
        <section className="bg-white rounded-[28px] border border-[#dce8de] overflow-hidden shadow-sm">

          {/* MAP AREA */}
          <div className="relative h-56 md:h-72 bg-gradient-to-br from-[#e8f3e9] via-[#eff5ff] to-[#dcefe0]">

            <div className="absolute inset-0 opacity-40">

              <div className="absolute left-[15%] top-[25%] w-28 h-28 rounded-full bg-white/60" />
              <div className="absolute right-[18%] top-[15%] w-40 h-40 rounded-full bg-white/50" />
              <div className="absolute left-[45%] bottom-[10%] w-52 h-20 rounded-full bg-[#cfe5d2]/60 rotate-6" />

            </div>


            {/* CENTRE PIN */}
            <div className="absolute inset-0 flex items-center justify-center">

              <div className="relative">

                <div className="absolute -inset-5 bg-[#0d631b]/10 rounded-full animate-pulse" />

                <div className="relative w-16 h-16 rounded-full bg-[#0d631b] border-4 border-white shadow-xl flex items-center justify-center">

                  <Warehouse
                    size={29}
                    className="text-white"
                  />

                </div>

              </div>

            </div>


            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">

              <div className="bg-white/95 backdrop-blur rounded-xl px-4 py-2 shadow-sm">

                <p className="text-xs text-gray-500">
                  Distance
                </p>

                <p className="font-extrabold text-[#0d631b]">
                  {centre.distanceKm.toFixed(1)} km
                </p>

              </div>


              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${centre.latitude},${centre.longitude}`,
                    "_blank"
                  )
                }
                className="bg-white px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 text-sm font-bold text-[#0d631b]"
              >
                <Navigation size={17} />
                Open Maps
              </button>

            </div>

          </div>


          {/* CENTRE INFO */}
          <div className="p-5 md:p-7">

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">

              <div>

                <div className="flex items-center gap-3 flex-wrap">

                  <h2 className="text-2xl md:text-3xl font-extrabold">
                    {centre.name}
                  </h2>

                  <span className="flex items-center gap-1.5 bg-[#dff4e2] text-[#0d631b] px-3 py-1.5 rounded-full text-xs font-bold">

                    <span className="w-2 h-2 rounded-full bg-[#0d631b]" />

                    {centre.status === "ACTIVE"
                      ? "Accepting Bookings"
                      : centre.status || "Available"}

                  </span>

                </div>


                <div className="flex items-start gap-2 mt-3 text-gray-500">

                  <MapPin
                    size={19}
                    className="text-[#0d631b] mt-0.5 shrink-0"
                  />

                  <p className="text-sm">
                    {centre.address}
                  </p>

                </div>


                {draft.cropName && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-[#eff4ff] text-[#164b96] px-3 py-2 rounded-xl text-sm font-semibold">

                    <Wheat size={17} />

                    Selected crop:
                    <span className="font-extrabold">
                      {draft.cropName}
                    </span>

                  </div>
                )}

              </div>


              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${centre.latitude},${centre.longitude}`,
                    "_blank"
                  )
                }
                className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl border border-[#0d631b] text-[#0d631b] font-bold hover:bg-[#f2f8f3]"
              >
                <MapPin size={18} />
                View on Map
              </button>

            </div>

          </div>

        </section>


        {/* ================= CAPACITY ================= */}
        <section className="mt-6">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-xl font-extrabold">
                Today's Capacity
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current procurement availability
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[#0d631b]">
              <Clock3 size={18} />
              Today
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <CapacityCard
              label="Total Capacity"
              value={`${capacity.totalCapacity} qtl`}
              icon={Warehouse}
            />

            <CapacityCard
              label="Already Reserved"
              value={`${capacity.reservedCapacity} qtl`}
              icon={Scale}
            />

            <CapacityCard
              label="Remaining"
              value={`${capacity.remainingCapacity} qtl`}
              icon={CheckCircle2}
              highlight
            />

          </div>


          {/* CAPACITY BAR */}
          <div className="mt-4 bg-white border border-[#dce8de] rounded-2xl p-5">

            <div className="flex justify-between items-center mb-3">

              <span className="text-sm font-semibold text-gray-600">
                Remaining capacity
              </span>

              <span className="text-sm font-extrabold text-[#0d631b]">
                {Math.round(capacityPercent)}%
              </span>

            </div>

            <div className="h-3 bg-[#e8eee9] rounded-full overflow-hidden">

              <div
                className="h-full bg-[#0d631b] rounded-full transition-all"
                style={{ width: `${capacityPercent}%` }}
              />

            </div>

          </div>

        </section>


        {/* ================= FACILITIES ================= */}
        <section className="mt-7">

          <div className="mb-4">

            <h2 className="text-xl font-extrabold">
              Centre Facilities
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              सुविधाएँ उपलब्ध हैं
            </p>

          </div>


          {centre.facilities?.length > 0 ? (

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {centre.facilities.map((facility) => {

                const Icon =
                  FACILITY_ICONS[facility.toLowerCase()] ||
                  CheckCircle2;

                return (
                  <div
                    key={facility}
                    className="bg-white border border-[#dce8de] rounded-2xl p-5 hover:shadow-sm transition"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-[#e8f5ea] text-[#0d631b] flex items-center justify-center">

                      <Icon size={24} />

                    </div>

                    <p className="font-bold mt-4 text-sm">
                      {facility}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#0d631b] font-semibold">

                      <CheckCircle2 size={14} />

                      Available

                    </div>

                  </div>
                );
              })}

            </div>

          ) : (

            <div className="bg-white border border-[#dce8de] rounded-2xl p-6 text-center">

              <p className="text-sm text-gray-500">
                Facility information not available.
              </p>

            </div>

          )}

        </section>


        {/* ================= NEXT STEP INFO ================= */}
        <section className="mt-7 bg-[#eff4ff] border border-[#d8e2f4] rounded-3xl p-5 md:p-6">

          <div className="flex items-start gap-4">

            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white flex items-center justify-center">

              <Clock3
                size={24}
                className="text-[#0d631b]"
              />

            </div>

            <div>

              <h3 className="font-extrabold">
                Choose your preferred time
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Check available slots for your selected crop,
                quantity and date.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* ================= BOTTOM CTA ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-[#dce8de]">

        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-4">

          <button
            onClick={() =>
              navigate(`/farmer/centres/${id}/slots`)
            }
            className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-extrabold flex items-center justify-center gap-2 shadow-lg transition"
          >

            View Available Time Slots

            <ChevronRight size={21} />

          </button>

        </div>

      </div>

    </div>
  );
}


function CapacityCard({
  label,
  value,
  icon: Icon,
  highlight,
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        highlight
          ? "bg-[#eff8ef] border-[#b9dcbc]"
          : "bg-white border-[#dce8de]"
      }`}
    >

      <div className="flex items-center justify-between">

        <div className="w-11 h-11 rounded-xl bg-[#e8f5ea] text-[#0d631b] flex items-center justify-center">
          <Icon size={22} />
        </div>

        {highlight && (
          <span className="text-xs font-bold text-[#0d631b] bg-white px-2.5 py-1 rounded-full">
            Available
          </span>
        )}

      </div>

      <p className="text-sm text-gray-500 mt-5">
        {label}
      </p>

      <p
        className={`text-2xl font-extrabold mt-1 ${
          highlight
            ? "text-[#0d631b]"
            : "text-[#12351a]"
        }`}
      >
        {value}
      </p>

    </div>
  );
}