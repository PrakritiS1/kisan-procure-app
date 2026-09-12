// Centre details
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Scale, Warehouse, Droplet, Users, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
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
      getCentreDetails(id, { latitude: draft.latitude || 0, longitude: draft.longitude || 0 }),
      getCentreCapacity(id),
    ])
      .then(([c, cap]) => {
        setCentre(c);
        setCapacity(cap);
        updateDraft({ centreId: Number(id), centreName: c.name, distanceKm: c.distanceKm });
      })
      .catch(() => setError("Couldn't load centre details."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!centre || !capacity) return <div className="p-6 text-sm text-brand-500">Loading centre...</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar title="Centre Details" />

      <div className="h-40 bg-brand-100 flex items-center justify-center">
        <MapPin className="text-brand-400" size={40} />
      </div>

      <div className="px-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-900">{centre.name}</h2>
          <span className="text-sm text-brand-500">{centre.distanceKm.toFixed(1)} km</span>
        </div>
        {draft.cropName && <p className="text-sm text-brand-500">{draft.cropName}</p>}
        <p className="text-sm text-brand-500 mt-1">{centre.address}</p>

        <button className="btn-secondary mt-4" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${centre.latitude},${centre.longitude}`, "_blank")}>
          View on Map
        </button>

        <div className="card mt-6">
          <h3 className="font-semibold text-brand-900 mb-3">Today's Capacity</h3>
          <Row label="Total Capacity" value={`${capacity.totalCapacity} qtl`} />
          <Row label="Already Reserved" value={`${capacity.reservedCapacity} qtl`} />
          <Row label="Remaining" value={`${capacity.remainingCapacity} qtl`} highlight />
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-brand-900 mb-3">Facilities</h3>
          <div className="grid grid-cols-4 gap-3">
            {(centre.facilities || []).map((f) => {
              const Icon = FACILITY_ICONS[f.toLowerCase()] || CheckCircle2;
              return (
                <div key={f} className="flex flex-col items-center gap-1 text-center">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs text-brand-600">{f}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 px-6 py-4 max-w-md mx-auto">
        <button className="btn-primary" onClick={() => navigate(`/farmer/centres/${id}/slots`)}>View Time Slots</button>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-brand-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-brand-700" : "text-brand-900"}`}>{value}</span>
    </div>
  );
}