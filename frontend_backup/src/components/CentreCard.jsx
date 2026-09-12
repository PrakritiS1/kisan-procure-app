// Centre card component
import { ChevronRight } from "lucide-react";

const STATUS_DOT = { ACTIVE: "bg-brand-600", PAUSED: "bg-gold-500", INACTIVE: "bg-gray-400" };

export default function CentreCard({ centre, onClick }) {
  const low = centre.availableCapacity <= 0;
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between card text-left hover:border-brand-300">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${low ? "bg-red-500" : STATUS_DOT[centre.status] || "bg-brand-600"}`} />
        <div>
          <p className="font-semibold text-brand-900">{centre.name}</p>
          <p className="text-sm text-brand-500">
            {centre.distanceKm.toFixed(1)} km · {low ? "Full for selected time" : `${centre.availableCapacity} qtl available`}
          </p>
        </div>
      </div>
      <ChevronRight className="text-brand-300" size={20} />
    </button>
  );
}