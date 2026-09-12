// Weighment
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { getBooking } from "../../services/bookings.js";
import { submitWeighment } from "../../services/officer.js";

export default function Weighment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [unit, setUnit] = useState("quintal");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBooking(id).then((b) => setExpected(b.quantity)).catch(() => {});
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await submitWeighment(id, { expectedQuantity: Number(expected), actualQuantity: Number(actual), unit });
      navigate(`/officer/bookings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save weighment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-brand-900 mb-6">Weighment</h1>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="text-sm text-brand-700">Expected Quantity</label>
            <input className="input-field mt-1" type="number" value={expected} onChange={(e) => setExpected(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-brand-700">Actual Weighed Quantity</label>
            <input className="input-field mt-1" type="number" value={actual} onChange={(e) => setActual(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-brand-700">Unit</label>
            <input className="input-field mt-1" value={unit} onChange={(e) => setUnit(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary" disabled={saving} type="submit">{saving ? "Saving..." : "Submit Weighment"}</button>
        </form>
      </main>
    </div>
  );
}