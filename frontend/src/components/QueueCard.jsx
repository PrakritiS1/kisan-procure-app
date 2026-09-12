// Queue card component
const STATUS_COLOR = {
  WAITING: "bg-gold-400/20 text-gold-500",
  CHECKED_IN: "bg-brand-50 text-brand-600",
  QUALITY_CHECK: "bg-blue-50 text-blue-600",
  WEIGHMENT: "bg-purple-50 text-purple-600",
  PROCUREMENT: "bg-brand-50 text-brand-700",
  COMPLETED: "bg-brand-100 text-brand-700",
};

export default function QueueCard({ item, onClick }) {
  return (
    <button onClick={onClick} className="w-full card flex items-center justify-between text-left">
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-brand-800 text-white flex items-center justify-center text-sm font-semibold">
          {item.tokenNumber}
        </span>
        <div>
          <p className="font-medium text-brand-900">{item.farmerName}</p>
          <p className="text-xs text-brand-500">{item.crop} · {item.quantity} qtl · {item.bookingId}</p>
        </div>
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLOR[item.status] || "bg-brand-50 text-brand-600"}`}>
        {item.status}
      </span>
    </button>
  );
}