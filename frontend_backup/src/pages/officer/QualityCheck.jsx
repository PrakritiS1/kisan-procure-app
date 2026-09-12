// Quality check
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { submitQualityCheck } from "../../services/officer.js";

export default function QualityCheck() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ moisture: "", foreignMatter: "", qualityGrade: "", status: "PASSED", remarks: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await submitQualityCheck(id, {
        moisture: Number(form.moisture),
        foreignMatter: Number(form.foreignMatter),
        qualityGrade: form.qualityGrade,
        status: form.status,
        remarks: form.remarks,
      });
      navigate(`/officer/bookings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save quality check.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-brand-50">
      <Sidebar />
      <main className="flex-1 p-8 max-w-lg">
        <h1 className="text-2xl font-bold text-brand-900 mb-6">Quality Check</h1>
        <form onSubmit={handleSubmit} className="card space-y-4">
          <Field label="Moisture (%)" type="number" value={form.moisture} onChange={(v) => update("moisture", v)} required />
          <Field label="Foreign Matter (%)" type="number" value={form.foreignMatter} onChange={(v) => update("foreignMatter", v)} required />
          <Field label="Quality Grade" value={form.qualityGrade} onChange={(v) => update("qualityGrade", v)} placeholder="e.g. A, B, C" required />
          <div>
            <label className="text-sm text-brand-700">Result</label>
            <div className="flex gap-3 mt-1">
              {["PASSED", "FAILED"].map((s) => (
                <label key={s} className={`flex-1 text-center py-2 rounded-xl border-2 text-sm cursor-pointer ${form.status === s ? "border-brand-600 bg-brand-50" : "border-brand-100"}`}>
                  <input type="radio" name="status" className="hidden" checked={form.status === s} onChange={() => update("status", s)} />
                  {s === "PASSED" ? "Passed" : "Failed"}
                </label>
              ))}
            </div>
          </div>
          <Field label="Remarks (optional)" value={form.remarks} onChange={(v) => update("remarks", v)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary" disabled={saving} type="submit">{saving ? "Saving..." : "Submit Quality Check"}</button>
        </form>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }) {
  return (
    <div>
      <label className="text-sm text-brand-700">{label}</label>
      <input className="input-field mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </div>
  );
}