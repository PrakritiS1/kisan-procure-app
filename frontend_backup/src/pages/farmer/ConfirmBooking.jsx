// Booking confirmation
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Scale as ScaleIcon, MapPin } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import { createBooking } from "../../services/bookings.js";
import { useBooking } from "../../context/BookingContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const { draft, setLastBooking } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setLoading(true);
    setError("");
    try {
      const res = await createBooking({
        cropId: draft.cropId,
        quantity: Number(draft.quantity),
        centreId: draft.centreId,
        slotId: draft.slotId,
      });
      setLastBooking(res.booking);
      navigate(`/farmer/bookings/${res.booking.id}/confirmed`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't confirm booking. The slot may have just filled up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-28">
      <Navbar title="Confirm Booking" />

      <div className="px-6 pt-4">
        <div className="card">
          <div className="h-24 bg-brand-100 rounded-xl mb-3 flex items-center justify-center">
            <MapPin className="text-brand-400" size={24} />
          </div>
          <p className="font-semibold text-brand-900">{draft.centreName}</p>
          <p className="text-sm text-brand-500">{draft.cropName}</p>
        </div>

        <div className="mt-4 space-y-3">
          <DetailRow icon={<Calendar size={16} />} label="Date" value={draft.date ? formatDate(draft.date) : "—"} />
          <DetailRow icon={<Clock size={16} />} label="Time" value={draft.slotLabel || "—"} />
          <DetailRow icon={<ScaleIcon size={16} />} label="Expected Quantity" value={`${draft.quantity} qtl`} />
          <DetailRow icon={<MapPin size={16} />} label="Distance" value={draft.distanceKm != null ? `${draft.distanceKm.toFixed(1)} km` : "—"} />
        </div>

        <div className="mt-6 rounded-xl bg-gold-400/20 border border-gold-400 p-3 text-sm text-brand-800">
          Your capacity will be reserved. Please bring approximately the declared quantity.
        </div>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 px-6 py-4 max-w-md mx-auto">
        <button className="btn-primary" disabled={loading} onClick={handleConfirm}>
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-brand-500">
        <span className="text-brand-400">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-medium text-brand-900">{value}</span>
    </div>
  );
}