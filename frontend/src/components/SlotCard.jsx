// Slot card component
export default function SlotCard({ slot, selected, onSelect }) {
  const full = slot.availableCapacity <= 0 || slot.status === "FULL";
  return (
    <label
      className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 ${
        full ? "border-brand-50 opacity-50 cursor-not-allowed" : selected ? "border-brand-600 bg-brand-50 cursor-pointer" : "border-brand-100 cursor-pointer"
      }`}
    >
      <span className="flex items-center gap-3">
        <input type="radio" name="slot" disabled={full} checked={selected} onChange={() => onSelect(slot)} className="accent-brand-600" />
        <span className="text-sm text-brand-800">{slot.startTime} – {slot.endTime}</span>
      </span>
      <span className={`text-sm font-medium ${full ? "text-red-500" : "text-brand-600"}`}>
        {full ? "Full" : `${slot.availableCapacity} qtl available`}
      </span>
    </label>
  );
}