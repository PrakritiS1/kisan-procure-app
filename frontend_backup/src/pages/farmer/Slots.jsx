import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import SlotCard from "../../components/SlotCard.jsx";
import { getCentreSlots } from "../../services/centres.js";
import { useBooking } from "../../context/BookingContext.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Slots() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(draft.slotId || null);

  useEffect(() => {
    if (!draft.date || !draft.cropId) {
      setError("Missing crop/date — go back and start from Select Crop.");
      setLoading(false);
      return;
    }
    getCentreSlots(id, { date: draft.date, cropId: draft.cropId, quantity: draft.quantity })
      .then((res) => setSlots(res.slots))
      .catch(() => setError("Couldn't load time slots."))
      .finally(() => setLoading(false));
  }, [id, draft.date, draft.cropId, draft.quantity]);

  const selected = slots.find((s) => s.id === selectedId);
  const fits = selected && selected.availableCapacity >= Number(draft.quantity);

  function handleBook() {
    updateDraft({ slotId: selected.id, slotLabel: `${selected.startTime} – ${selected.endTime}` });
    navigate("/farmer/confirm");
  }

  return (
    <div className="min-h-screen bg-white pb-40">
      <Navbar title="Available Time Slots" />
      <div className="px-6 pt-4">
        <h2 className="text-lg font-bold text-brand-900">
          {draft.cropName} • {draft.date ? formatDate(draft.date) : ""}
        </h2>
      </div>

      {loading && <p className="px-6 py-6 text-sm text-brand-500">Loading slots...</p>}
      {error && <p className="px-6 py-6 text-sm text-red-600">{error}</p>}

      <div className="px-6 pt-4 space-y-2">
        {slots.map((s) => (
          <SlotCard key={s.id} slot={s} selected={selectedId === s.id} onSelect={(slot) => setSelectedId(slot.id)} />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 px-6 py-4 max-w-md mx-auto space-y-3">
        {selected && (
          <div className={`rounded-xl p-3 text-sm ${fits ? "bg-brand-50 text-brand-700" : "bg-red-50 text-red-600"}`}>
            <p className="font-semibold">Your Requirement</p>
            <p>{draft.quantity} qtl</p>
            <p className="mt-1">{fits ? "This slot can accommodate your quantity." : "This slot may not fit your full quantity."}</p>
          </div>
        )}
        <button className="btn-primary" disabled={!selected || !fits} onClick={handleBook}>Book Now</button>
      </div>
    </div>
  );
}