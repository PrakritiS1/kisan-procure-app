import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  ChevronRight,
  Warehouse,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

import MapView from "../../components/MapView.jsx";
import { getNearbyCentres } from "../../services/centres.js";
import { useBooking } from "../../context/BookingContext.jsx";

const SORT_OPTIONS = [
  { id: "nearest", label: "Nearest" },
  { id: "capacity", label: "Most Capacity" },
];

export default function Centres() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();

  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("nearest");

  useEffect(() => {
    if (draft.latitude == null || draft.longitude == null) {
      setError(
        "No location set — go back and share your location first."
      );
      setLoading(false);
      return;
    }

    getNearbyCentres({
      latitude: draft.latitude,
      longitude: draft.longitude,
      radius: draft.radiusKm || 10,
      cropId: draft.cropId,
    })
      .then(setCentres)
      .catch(() =>
        setError(
          "Couldn't load nearby centres. Is the backend running?"
        )
      )
      .finally(() => setLoading(false));
  }, [
    draft.latitude,
    draft.longitude,
    draft.radiusKm,
    draft.cropId,
  ]);

  const sorted = useMemo(() => {
    const list = [...centres];

    if (sort === "capacity") {
      list.sort(
        (a, b) => b.availableCapacity - a.availableCapacity
      );
    } else {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  }, [centres, sort]);

  function openCentre(id) {
    updateDraft({ centreId: id });
    navigate(`/farmer/centres/${id}`);
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#12351a]">

      {/* HEADER */}
      <header className="bg-white border-b border-[#dce8de] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center gap-4">

          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-xl border border-[#dce8de] flex items-center justify-center hover:bg-[#f1f7f2]"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="font-extrabold text-xl">
              Available Centres
            </h1>

            <p className="text-sm text-gray-500">
              Nearby procurement centres
            </p>
          </div>

        </div>
      </header>


      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-6">

        {/* LOCATION SUMMARY */}
        <section className="bg-white rounded-3xl border border-[#dce8de] p-5 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-[#e5f5e7] flex items-center justify-center">
                <MapPin
                  size={25}
                  className="text-[#0d631b]"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Searching near
                </p>

                <p className="font-extrabold text-lg">
                  {draft.locationLabel || "Current location"}
                </p>

                <p className="text-sm text-gray-500">
                  Within {draft.radiusKm || 10} km radius
                </p>
              </div>

            </div>


            <button
              onClick={() => navigate("/farmer/location")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#0d631b] text-[#0d631b] font-bold text-sm hover:bg-[#f1f8f2]"
            >
              <Navigation size={17} />
              Change Location
            </button>

          </div>

        </section>


        {/* MAP */}
        <section className="mt-5 bg-white rounded-3xl border border-[#dce8de] overflow-hidden shadow-sm">

          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">

            <div>
              <h2 className="font-extrabold text-lg">
                Centres Near You
              </h2>

              <p className="text-sm text-gray-500">
                Select a centre to view available slots
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-[#0d631b] font-semibold">
              <MapPin size={17} />
              Map View
            </div>

          </div>


          <div className="h-[300px] md:h-[380px]">

            {draft.latitude != null &&
            draft.longitude != null ? (

              <MapView
                userPosition={{
                  lat: draft.latitude,
                  lng: draft.longitude,
                }}
                centres={sorted}
                onSelectCentre={openCentre}
              />

            ) : (

              <div className="h-full flex flex-col items-center justify-center bg-[#f3f7f3]">

                <MapPin
                  size={40}
                  className="text-gray-300 mb-3"
                />

                <p className="text-sm text-gray-500">
                  Map unavailable
                </p>

              </div>

            )}

          </div>

        </section>


        {/* LIST HEADER */}
        <section className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>

            <h2 className="text-xl font-extrabold">
              Nearby Centres
            </h2>

            {!loading && !error && (
              <p className="text-sm text-gray-500 mt-1">
                {sorted.length} centre
                {sorted.length !== 1 ? "s" : ""} available
              </p>
            )}

          </div>


          <div className="flex items-center gap-2">

            <SlidersHorizontal
              size={18}
              className="text-gray-500"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-[#dce8de] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#cfe3d4]"
            >

              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.id}
                  value={option.id}
                >
                  {option.label}
                </option>
              ))}

            </select>

          </div>

        </section>


        {/* LOADING */}
        {loading && (
          <div className="mt-4 grid md:grid-cols-2 gap-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-[#dce8de] rounded-2xl p-5 animate-pulse"
              >

                <div className="flex gap-4">

                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />

                  <div className="flex-1">

                    <div className="h-5 bg-gray-200 rounded w-2/3" />

                    <div className="h-4 bg-gray-100 rounded w-1/2 mt-3" />

                    <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}


        {/* ERROR */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-3">

            <AlertCircle
              className="text-red-500 shrink-0"
              size={22}
            />

            <div>
              <p className="font-bold text-red-700">
                Unable to load centres
              </p>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>
            </div>

          </div>
        )}


        {/* EMPTY */}
        {!loading &&
          !error &&
          sorted.length === 0 && (
            <div className="mt-4 bg-white border border-[#dce8de] rounded-3xl p-10 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#eef5ef] flex items-center justify-center">

                <Warehouse
                  size={32}
                  className="text-[#0d631b]"
                />

              </div>

              <h3 className="font-extrabold text-lg mt-4">
                No centres found
              </h3>

              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                We couldn't find any procurement centres
                within your selected radius.
              </p>

              <button
                onClick={() => navigate("/farmer/location")}
                className="mt-5 px-5 py-3 rounded-xl bg-[#0d631b] text-white font-bold"
              >
                Change Search Area
              </button>

            </div>
          )}


        {/* CENTRE CARDS */}
        {!loading &&
          !error &&
          sorted.length > 0 && (

            <div className="mt-4 grid md:grid-cols-2 gap-4 pb-10">

              {sorted.map((centre) => {

                const full =
                  centre.availableCapacity <= 0;

                const low =
                  centre.availableCapacity > 0 &&
                  centre.availableCapacity < 30;

                return (
                  <button
                    key={centre.id}
                    onClick={() => openCentre(centre.id)}
                    className="w-full text-left bg-white border border-[#dce8de] rounded-2xl p-5 hover:shadow-md hover:border-[#b8d5bc] transition"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-4">

                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#e8f5ea] flex items-center justify-center">

                          <Warehouse
                            size={24}
                            className="text-[#0d631b]"
                          />

                        </div>


                        <div>

                          <div className="flex items-center gap-2 flex-wrap">

                            <h3 className="font-extrabold text-lg">
                              {centre.name}
                            </h3>

                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                full
                                  ? "bg-red-500"
                                  : low
                                  ? "bg-amber-500"
                                  : "bg-[#0d631b]"
                              }`}
                            />

                          </div>


                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

                            <MapPin size={15} />

                            {centre.distanceKm.toFixed(1)} km away

                          </div>

                        </div>

                      </div>


                      <ChevronRight
                        size={22}
                        className="text-gray-400 shrink-0"
                      />

                    </div>


                    {/* CAPACITY */}
                    <div className="mt-5 rounded-xl bg-[#f5f9f5] p-4">

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-gray-500">
                          Available capacity
                        </span>

                        <span
                          className={`text-sm font-extrabold ${
                            full
                              ? "text-red-600"
                              : low
                              ? "text-amber-600"
                              : "text-[#0d631b]"
                          }`}
                        >
                          {full
                            ? "Full"
                            : `${centre.availableCapacity} qtl`}
                        </span>

                      </div>

                    </div>


                    {/* STATUS */}
                    <div className="mt-4 flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        {!full ? (
                          <CheckCircle2
                            size={18}
                            className="text-[#0d631b]"
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                            className="text-red-500"
                          />
                        )}

                        <span className="text-sm font-semibold">
                          {full
                            ? "Full for selected time"
                            : centre.status === "PAUSED"
                            ? "Temporarily paused"
                            : "Accepting bookings"}
                        </span>

                      </div>

                      <span className="text-sm font-bold text-[#0d631b]">
                        View details
                      </span>

                    </div>

                  </button>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}