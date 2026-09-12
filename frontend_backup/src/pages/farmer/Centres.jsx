// Nearby centres
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import MapView from "../../components/MapView.jsx";
import CentreCard from "../../components/CentreCard.jsx";
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
      setError("No location set — go back and share your location first.");
      setLoading(false);
      return;
    }
    getNearbyCentres({ latitude: draft.latitude, longitude: draft.longitude, radius: draft.radiusKm || 10, cropId: draft.cropId })
      .then(setCentres)
      .catch(() => setError("Couldn't load nearby centres. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [draft.latitude, draft.longitude, draft.radiusKm, draft.cropId]);

  const sorted = useMemo(() => {
    const list = [...centres];
    if (sort === "capacity") list.sort((a, b) => b.availableCapacity - a.availableCapacity);
    else list.sort((a, b) => a.distanceKm - b.distanceKm);
    return list;
  }, [centres, sort]);

  function openCentre(id) {
    updateDraft({ centreId: id });
    navigate(`/farmer/centres/${id}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar title="Available Centres (Map View)" />

      <div className="h-64 shrink-0">
        {draft.latitude != null ? (
          <MapView userPosition={{ lat: draft.latitude, lng: draft.longitude }} centres={sorted} onSelectCentre={() => {}} />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-brand-400 bg-brand-50">Map unavailable</div>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-3">
        <h3 className="font-semibold text-brand-900">Nearby Centres</h3>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm border border-brand-200 rounded-lg px-2 py-1 text-brand-700">
          {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      {loading && <p className="px-6 text-sm text-brand-500">Loading centres...</p>}
      {error && <p className="px-6 text-sm text-red-600">{error}</p>}

      <div className="px-6 pb-8 space-y-3 flex-1 overflow-y-auto">
        {!loading && !error && sorted.length === 0 && <p className="text-sm text-brand-500">No centres found in this radius.</p>}
        {sorted.map((centre) => <CentreCard key={centre.id} centre={centre} onClick={() => openCentre(centre.id)} />)}
      </div>
    </div>
  );
}