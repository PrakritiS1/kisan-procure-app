// Booking card component
 import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_LABEL = {
  BOOKED: "Booked", CHECKED_IN: "Checked In", WAITING: "Waiting",
  QUALITY_CHECK: "Quality Check", WEIGHMENT: "Weighment",
  PROCUREMENT: "Processing", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

export default function BookingCard({ booking }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/farmer/bookings/${booking.id}`)} className="w-full card text-left flex items-center justify-between">
      <div>
        <p className="font-semibold text-brand-900">{booking.booking}</p>
        <p className="text-sm text-brand-500">{booking.crop} · {booking.quantity} qtl</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
          {STATUS_LABEL[booking.status] || booking.status}
        </span>
        <ChevronRight className="text-brand-300" size={18} />
      </div>
    </button>
  );
}