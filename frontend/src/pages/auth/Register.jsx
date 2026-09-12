// Registration page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const initial = { name: "", phone: "", email: "", password: "", village: "", district: "", state: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ ...form, email: form.email || undefined });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Register" />
      <form onSubmit={handleSubmit} className="px-6 py-8 max-w-sm mx-auto space-y-4">
        <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required />
        <Field label="Phone Number" type="tel" value={form.phone} onChange={(v) => update("phone", v.replace(/\D/g, "").slice(0, 10))} required />
        <Field label="Email (optional)" type="email" value={form.email} onChange={(v) => update("email", v)} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} required />
        <Field label="Village" value={form.village} onChange={(v) => update("village", v)} required />
        <Field label="District" value={form.district} onChange={(v) => update("district", v)} required />
        <Field label="State" value={form.state} onChange={(v) => update("state", v)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="text-center text-sm text-brand-500">
          Already have an account?{" "}
          <button type="button" className="text-brand-700 font-semibold underline" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="text-sm font-medium text-brand-800">{label}</label>
      <input className="input-field mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  );
}