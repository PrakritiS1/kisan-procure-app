// Dashboard statistics card
const ACCENTS = {
  brand: "bg-brand-50 text-brand-600",
  gold: "bg-gold-400/20 text-gold-500",
  red: "bg-red-50 text-red-500",
};

export default function StatsCard({ label, value, icon, accent = "brand" }) {
  return (
    <div className="card flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${ACCENTS[accent] || ACCENTS.brand}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-brand-900">{value}</p>
        <p className="text-xs text-brand-500">{label}</p>
      </div>
    </div>
  );
}