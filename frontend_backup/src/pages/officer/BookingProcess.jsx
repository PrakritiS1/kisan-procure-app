// Booking process
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardCheck, Scale, PackageCheck } from "lucide-react";
import Sidebar from "../../components/Sidebar.jsx";
import { getBooking } from "../../services/bookings.js";
import { submitProcurement, updateBookingStatus } from "../../services/officer.js";

export default function BookingProcess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBooking(id).then((b) => { setBooking(b); setQuantity(b.quantity); }).catch(() => setError("Couldn't load booking."));
  }, [id]);

  async function handleFinalizeProcurement(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await submitProcurement(id, { quantity: Number(quantity), rate: Number(rate) });
      setBooking(await getBooking(id));
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't finalize procurement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Mark this booking as cancelled?")) return;
    await updateBookingStatus(id, "CANCELLED").catch(() => {});
    setBooking(await getBooking(id).catch(() => booking));
  }

  if (error && !booking) return <div className="min-h-screen flex"><Sidebar /><div className="p-8 text-sm text-red-600">{error}</div></div>;
  if (!booking) return <div className="min-h-screen flex"><Sidebar /><div className="p-8 text-sm text-brand-500">Loading...</div></div>;

  return (
    <div className="min-h-screen flex bg-brand-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-brand-900 mb-1">{booking.booking}</h1>
        <p className="text-sm text-brand-500 mb-6">{booking.crop} · {booking.quantity} qtl · Status: {booking.status}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="card flex flex-col items-center gap-2 py-6" onClick={() => navigate(`/officer/bookings/${id}/quality`)}>
            <ClipboardCheck className="text-brand-600" size={26} />
            <span className="text-sm font-medium text-brand-800">Quality Check</span>
          </button>
          <button className="card flex flex-col items-center gap-2 py-6" onClick={() => navigate(`/officer/bookings/${id}/weighment`)}>
            <Scale className="text-brand-600" size={26} />
            <span className="text-sm font-medium text-brand-800">Weighment</span>
          </button>
        </div>

        <form onSubmit={handleFinalizeProcurement} className="card space-y-3">
          <h3 className="font-semibold text-brand-900 flex items-center gap-2"><PackageCheck size={18} /> Finalize Procurement</h3>
          <div>
            <label className="text-sm text-brand-700">Final Quantity (qtl)</label>
            <input className="input-field mt-1" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-brand-700">Rate (₹ per qtl)</label>
            <input className="input-field mt-1" type="number" value={rate} onChange={(e) => setRate(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary" disabled={saving} type="submit">{saving ? "Saving..." : "Complete Procurement"}</button>
        </form>

        <button onClick={handleCancel} className="text-sm text-red-600 font-medium mt-6">Cancel this booking</button>
      </main>
    </div>
  );
}