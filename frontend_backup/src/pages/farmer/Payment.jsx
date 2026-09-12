// Payment status
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import { getBooking } from "../../services/bookings.js";

export default function Payment() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooking(id).then(setBooking).catch(() => setError("Couldn't load booking."));
  }, [id]);

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!booking) return <div className="p-6 text-sm text-brand-500">Loading...</div>;

  const done = booking.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-white pb-10">
      <Navbar title="Payment" />
      <div className="px-6 pt-8 text-center">
        {done ? <CheckCircle2 className="mx-auto text-brand-600 mb-3" size={48} /> : <Clock className="mx-auto text-gold-500 mb-3" size={48} />}
        <h2 className="text-lg font-bold text-brand-900">{done ? "Procurement Completed" : "Payment Pending"}</h2>
        <p className="text-sm text-brand-500 mt-2">
          {done
            ? "Your crop has been procured. Payment is processed by the centre and credited to your registered account."
            : "Payment will be initiated once weighment and procurement are completed at the centre."}
        </p>
      </div>
    </div>
  );
}