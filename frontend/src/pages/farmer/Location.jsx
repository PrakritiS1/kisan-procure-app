import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  LocateFixed,
  Search,
  Navigation,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import { useBooking } from "../../context/BookingContext.jsx";

const RADIUS_OPTIONS = [5, 10, 25];

export default function Location() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();

  const [useGps, setUseGps] = useState(false);

  const [manualArea, setManualArea] = useState(
    draft.locationLabel && draft.locationLabel !== "Current location"
      ? draft.locationLabel
      : ""
  );

  const [radius, setRadius] = useState(draft.radiusKm || 10);

  const [locating, setLocating] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);

  const [error, setError] = useState("");

  const [coords, setCoords] = useState(
    draft.latitude !== null &&
      draft.latitude !== undefined &&
      draft.longitude !== null &&
      draft.longitude !== undefined
      ? {
        lat: Number(draft.latitude),
        lng: Number(draft.longitude),
      }
      : null
  );

  const [resolvedAddress, setResolvedAddress] = useState(
    draft.locationLabel && draft.locationLabel !== "Current location"
      ? draft.locationLabel
      : ""
  );

  // ---------------------------------------------------------
  // GPS LOCATION
  // ---------------------------------------------------------

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't available on this device/browser.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCoords({
          lat,
          lng,
        });

        setResolvedAddress("Current location");

        setLocating(false);
      },
      () => {
        setError(
          "Couldn't get your location. Please allow location access or enter your area manually."
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  // ---------------------------------------------------------
  // TOGGLE GPS / MANUAL
  // ---------------------------------------------------------

  function handleToggle(next) {
    setUseGps(next);
    setError("");

    if (next) {
      locate();
    } else {
      setCoords(null);
      setResolvedAddress("");
    }
  }

  // ---------------------------------------------------------
  // MANUAL ADDRESS → LAT/LNG
  // ---------------------------------------------------------

  async function searchAddress() {
    const query = manualArea.trim();

    if (!query) {
      setError("Please enter a village, town, area or city.");
      return;
    }

    setSearchingAddress(true);
    setError("");
    setCoords(null);
    setResolvedAddress("");

    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        limit: "1",
        countrycodes: "in",
        addressdetails: "1",
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Location search failed.");
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        setError(
          "Location not found. Try a more specific address, for example: Azadpur, Delhi 110033."
        );
        return;
      }

      const result = results[0];

      const lat = Number(result.lat);
      const lng = Number(result.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        setError("Could not read coordinates for this location.");
        return;
      }

      setCoords({
        lat,
        lng,
      });

      setResolvedAddress(result.display_name || query);

      // Keep the user's searched location in the input.
      setManualArea(query);
    } catch (err) {
      console.error("Geocoding error:", err);

      setError(
        "Unable to search this location right now. Please try again."
      );
    } finally {
      setSearchingAddress(false);
    }
  }

  // ---------------------------------------------------------
  // FIND PROCUREMENT CENTRES
  // ---------------------------------------------------------

  function handleFindCentres() {
    if (!coords) {
      setError("Please search and select a valid location first.");
      return;
    }

    updateDraft({
      latitude: coords.lat,
      longitude: coords.lng,
      radiusKm: radius,
      locationLabel: useGps
        ? "Current location"
        : resolvedAddress || manualArea.trim(),
    });

    navigate("/farmer/centres");
  }

  const canProceed = !!coords;

  return (
    <div className="min-h-screen bg-[#f5f8f5] pb-28">
      {/* ---------------------------------------------------
          HEADER
      --------------------------------------------------- */}
      <Navbar title="Your Location" />

      {/* ---------------------------------------------------
          BACK + STEPPER
      --------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-5 pt-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white border border-[#dce8df] flex items-center justify-center text-[#0d631b] hover:bg-[#eff6f0] transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="mt-5">
          <StatusStepper total={4} current={2} />
        </div>
      </div>

      {/* ---------------------------------------------------
          MAIN CONTENT
      --------------------------------------------------- */}
      <main className="max-w-6xl mx-auto px-5 py-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#0d631b]">
            STEP 2 OF 4
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-[#12351a] mt-1">
            Find a Procurement Centre
          </h1>

          <p className="text-gray-500 mt-2">
            Choose your current location or search for a village, town or area.
          </p>
        </div>

        {/* ---------------------------------------------------
            LOCATION METHOD
        --------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-[#dce8df] shadow-sm p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#173d20]">
                Location source
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                We use your coordinates to find nearby procurement centres.
              </p>
            </div>

            {/* GPS TOGGLE */}
            <button
              type="button"
              onClick={() => handleToggle(!useGps)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${useGps
                  ? "border-[#0d631b] bg-[#eff7f0]"
                  : "border-[#dce8df] bg-white"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${useGps
                    ? "bg-[#0d631b] text-white"
                    : "bg-[#eff4ff] text-[#315ea8]"
                  }`}
              >
                <LocateFixed size={20} />
              </div>

              <div className="text-left">
                <p className="font-bold text-[#173d20]">
                  Use my current location
                </p>

                <p className="text-xs text-gray-500">
                  {useGps ? "GPS enabled" : "GPS disabled"}
                </p>
              </div>

              <div
                className={`ml-2 w-11 h-6 rounded-full relative transition ${useGps ? "bg-[#0d631b]" : "bg-gray-300"
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${useGps ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </div>
            </button>
          </div>

          {/* -------------------------------------------------
              GPS MODE
          ------------------------------------------------- */}
          {useGps ? (
            <div className="mt-6">
              <div className="rounded-3xl bg-[#eff7f0] border border-[#d6ead9] p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#0d631b] text-white flex items-center justify-center shrink-0">
                    <Navigation size={23} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#173d20]">
                      Current location
                    </h3>

                    {coords ? (
                      <>
                        <p className="text-sm text-[#45604b] mt-1">
                          Location detected successfully.
                        </p>

                        <p className="text-xs text-gray-500 mt-2 font-mono">
                          {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">
                        Detect your location to continue.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={locate}
                  disabled={locating}
                  className="mt-5 w-full h-12 rounded-2xl border-2 border-[#0d631b] text-[#0d631b] font-bold flex items-center justify-center gap-2 hover:bg-white transition disabled:opacity-60"
                >
                  {locating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Detecting location...
                    </>
                  ) : (
                    <>
                      <LocateFixed size={18} />
                      {coords
                        ? "Update my location"
                        : "Detect my location"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* -------------------------------------------------
               MANUAL LOCATION
            ------------------------------------------------- */
            <div className="mt-6">
              <label className="block text-sm font-bold text-[#173d20] mb-2">
                Search your location
              </label>

              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d631b]"
                />

                <input
                  type="text"
                  value={manualArea}
                  onChange={(e) => {
                    setManualArea(e.target.value);
                    setCoords(null);
                    setResolvedAddress("");
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchAddress();
                    }
                  }}
                  placeholder="e.g. Azadpur, Delhi 110033"
                  className="w-full h-14 pl-12 pr-32 rounded-2xl border border-[#cfe3d4] bg-[#fbfdfb] text-[#173d20] outline-none focus:border-[#0d631b] focus:ring-2 focus:ring-[#d7eadb]"
                />

                <button
                  type="button"
                  onClick={searchAddress}
                  disabled={searchingAddress || !manualArea.trim()}
                  className="absolute right-2 top-2 h-10 px-4 rounded-xl bg-[#0d631b] text-white font-bold flex items-center gap-2 hover:bg-[#095216] transition disabled:opacity-50"
                >
                  {searchingAddress ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Search size={17} />
                  )}

                  <span className="hidden sm:inline">
                    {searchingAddress ? "Searching..." : "Search"}
                  </span>
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Try:{" "}
                <button
                  type="button"
                  className="text-[#0d631b] font-semibold hover:underline"
                  onClick={() => {
                    setManualArea("Azadpur, Delhi 110033");
                    setCoords(null);
                    setResolvedAddress("");
                    setError("");
                  }}
                >
                  Azadpur, Delhi 110033
                </button>
              </p>

              {/* RESOLVED ADDRESS */}
              {resolvedAddress && coords && (
                <div className="mt-4 rounded-2xl bg-[#eff7f0] border border-[#cfe5d3] p-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0d631b] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#0d631b] uppercase tracking-wide">
                        Location found
                      </p>

                      <p className="text-sm font-semibold text-[#173d20] mt-1">
                        {resolvedAddress}
                      </p>

                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------------------------------------
              ERROR
          ------------------------------------------------- */}
          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-600 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* -------------------------------------------------
              SEARCH RADIUS
          ------------------------------------------------- */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#173d20]">
                  Search Radius
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  How far should we search for centres?
                </p>
              </div>

              <span className="text-sm font-bold text-[#0d631b]">
                {radius} km
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`h-12 rounded-2xl border-2 font-bold transition ${radius === r
                      ? "border-[#0d631b] bg-[#eff7f0] text-[#0d631b]"
                      : "border-[#dce8df] bg-white text-gray-500 hover:border-[#9fc5a7]"
                    }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* -------------------------------------------------
              INFO
          ------------------------------------------------- */}
          <div className="mt-7 rounded-2xl bg-[#eff4ff] border border-[#dce7fa] p-4">
            <div className="flex gap-3">
              <MapPin className="text-[#315ea8] shrink-0" size={20} />

              <p className="text-sm text-[#425777]">
                Your selected coordinates are used only to find nearby
                procurement centres. You can change the location at any time.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-4">
            Location search uses OpenStreetMap/Nominatim.
          </p>
        </div>
      </main>

      {/* -----------------------------------------------------
          BOTTOM ACTION
      ----------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#dce8df] px-5 py-4 z-40">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            disabled={!canProceed}
            onClick={handleFindCentres}
            className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-bold text-base flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search size={20} />
            Find Procurement Centres
          </button>
        </div>
      </div>
    </div>
  );
}