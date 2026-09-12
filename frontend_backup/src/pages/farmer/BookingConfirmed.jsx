// Booking confirmed
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, MapPin, CalendarPlus } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import { getBooking } from "../../services/bookings.js";

function downloadIcs(booking) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:KisanProcure - ${booking.crop} booking at Centre #${booking.centreId}`,
    `DESCRIPTION:Booking ${booking.booking}, Token ${booking.tokenNumber}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kisanprocure-${booking.booking}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BookingConfirmed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooking(id).then(setBooking).catch(() => setError("Couldn't load booking."));
  }, [id]);

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!booking) return <div className="p-6 text-sm text-brand-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pb-8">
      <Navbar title="Booking Confirmed" showBack={false} />

      <div className="px-6 pt-8 text-center">
        <CheckCircle2 className="mx-auto text-brand-600 mb-3" size={56} />
        <h2 className="text-xl font-bold text-brand-900">Booking Confirmed!</h2>
        <p className="text-sm text-brand-500 mt-1">Your capacity is reserved.</p>
      </div>

      <div className="card mx-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-brand-500">Booking ID</span>
          <span className="font-semibold text-brand-900">{booking.booking}</span>
        </div>
        <Row label="Centre" value={`Centre #${booking.centreId}`} />
        <Row label="Crop" value={booking.crop} />
        <Row label="Expected Quantity" value={`${booking.quantity} qtl`} />
        <Row label="Status" value={booking.status} />
      </div>

      <div className="px-6 pt-4 flex gap-3">
        <button className="btn-secondary flex items-center justify-center gap-2" onClick={() => navigate(-1)}>
          <MapPin size={16} /> View on Map
        </button>
        <button className="btn-secondary flex items-center justify-center gap-2" onClick={() => downloadIcs(booking)}>
          <CalendarPlus size={16} /> Add to Calendar
        </button>
      </div>

      <div className="px-6 pt-6">
        <h3 className="font-semibold text-brand-900 mb-2">Important Instructions</h3>
        <ul className="text-sm text-brand-600 space-y-1.5 list-disc pl-5">
          <li>Bring your registered ID and land records.</li>
          <li>Arrive within the selected time window.</li>
          <li>Bring approximately the declared quantity.</li>
          <li>Follow centre staff instructions.</li>
        </ul>
      </div>

      <div className="px-6 pt-8">
        <button className="btn-primary" onClick={() => navigate(`/farmer/bookings/${id}/status`)}>Track Live Status</button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-brand-500">{label}</span>
      <span className="text-sm font-medium text-brand-900">{value}</span>
    </div>
  );
}