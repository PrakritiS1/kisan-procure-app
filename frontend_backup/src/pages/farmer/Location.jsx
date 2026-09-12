// Location selection
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, LocateFixed } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import { useBooking } from "../../context/BookingContext.jsx";

const RADIUS_OPTIONS = [5, 10, 25];

export default function Location() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();
  const [useGps, setUseGps] = useState(true);
  const [manualArea, setManualArea] = useState("");
  const [radius, setRadius] = useState(draft.radiusKm || 10);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(draft.latitude && draft.longitude ? { lat: draft.latitude, lng: draft.longitude } : null);

  function locate() {
    if (!navigator.geolocation) {
      setError("Geolocation isn't available on this device/browser.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Couldn't get your location. Please allow location access or enter your area manually.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleToggle(next) {
    setUseGps(next);
    if (next) locate();
  }

  function handleFindCentres() {
    updateDraft({
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      radiusKm: radius,
      locationLabel: useGps ? "Current location" : manualArea,
    });
    navigate("/farmer/centres");
  }

  const canProceed = useGps ? !!coords : manualArea.trim().length > 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar title="Your Location" />
      <StatusStepper total={4} current={2} />
      <div className="px-6 pt-4">
        <h2 className="text-xl font-bold text-brand-900">Use your current location to find nearby centres</h2>
      </div>

      <div className="px-6 pt-6">
        <div className="rounded-2xl bg-brand-50 border border-brand-100 h-40 flex items-center justify-center mb-4">
          {coords ? (
            <div className="text-center text-brand-700 text-sm">
              <MapPin className="mx-auto mb-1" size={28} />
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </div>
          ) : (
            <div className="text-center text-brand-400 text-sm">
              <MapPin className="mx-auto mb-1" size={28} />
              Location preview
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-brand-800">Use my current location</span>
          <button
            role="switch"
            aria-checked={useGps}
            onClick={() => handleToggle(!useGps)}
            className={`w-11 h-6 rounded-full transition-colors relative ${useGps ? "bg-brand-600" : "bg-brand-100"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${useGps ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {useGps ? (
          <button onClick={locate} disabled={locating} className="btn-secondary flex items-center justify-center gap-2">
            <LocateFixed size={18} />
            {locating ? "Locating..." : coords ? "Update my location" : "Detect my location"}
          </button>
        ) : (
          <div>
            <label className="text-sm font-medium text-brand-800">Enter village/town/area</label>
            <input className="input-field mt-1" placeholder="Enter village/town/area" value={manualArea} onChange={(e) => setManualArea(e.target.value)} />
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <div className="mt-6">
          <span className="text-sm font-medium text-brand-800">Search Radius</span>
          <div className="flex gap-2 mt-2">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium ${
                  radius === r ? "border-brand-600 bg-brand-50 text-brand-800" : "border-brand-100 text-brand-500"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 px-6 py-4 max-w-md mx-auto">
        <button className="btn-primary" disabled={!canProceed} onClick={handleFindCentres}>Find Centres</button>
      </div>
    </div>
  );
}