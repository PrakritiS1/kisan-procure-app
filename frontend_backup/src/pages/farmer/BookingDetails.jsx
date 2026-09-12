// Booking details
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import { getBooking, cancelBooking } from "../../services/bookings.js";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getBooking(id).then(setBooking).catch(() => setError("Couldn't load booking."));
  }, [id]);

  async function handleCancel() {
    const reason = window.prompt("Reason for cancelling this booking?");
    if (!reason) return;
    setCancelling(true);
    try {
      await cancelBooking(id, reason);
      setBooking(await getBooking(id));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't cancel booking.");
    } finally {
      setCancelling(false);
    }
  }

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!booking) return <div className="p-6 text-sm text-brand-500">Loading...</div>;

  const cancellable = !["COMPLETED", "CANCELLED"].includes(booking.status);

  return (
    <div className="min-h-screen bg-white pb-10">
      <Navbar title="Booking Details" />
      <div className="card mx-6 mt-6">
        <Row label="Booking ID" value={booking.booking} />
        <Row label="Crop" value={booking.crop} />
        <Row label="Expected Quantity" value={`${booking.quantity} qtl`} />
        <Row label="Status" value={booking.status} />
      </div>

      <div className="px-6 pt-4 space-y-3">
        <button className="btn-secondary" onClick={() => navigate(`/farmer/bookings/${id}/status`)}>View Live Status</button>
        {cancellable && (
          <button className="w-full text-red-600 text-sm font-semibold py-2" disabled={cancelling} onClick={handleCancel}>
            {cancelling ? "Cancelling..." : "Cancel Booking"}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-brand-500">{label}</span>
      <span className="text-sm font-medium text-brand-900">{value}</span>
    </div>
  );
}