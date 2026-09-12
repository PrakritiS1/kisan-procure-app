// Crop card component
import { Wheat, Sprout } from "lucide-react";

const ICONS = { wheat: Wheat, paddy: Sprout, rice: Sprout, maize: Sprout, mustard: Sprout };

export default function CropCard({ crop, selected, onSelect }) {
  const Icon = ICONS[crop.name?.toLowerCase()] || Sprout;
  return (
    <button
      type="button"
      onClick={() => onSelect(crop)}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-colors ${
        selected ? "border-brand-600 bg-brand-50" : "border-brand-100 bg-white"
      }`}
    >
      <Icon className={selected ? "text-brand-700" : "text-brand-400"} size={28} />
      <span className={`text-sm font-medium ${selected ? "text-brand-800" : "text-brand-600"}`}>{crop.name}</span>
    </button>
  );
}