// Login page
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(phone, password);
      navigate(user.role === "OFFICER" ? "/officer" : "/farmer");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid phone or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar title="Login" />
      <form onSubmit={handleSubmit} className="px-6 py-8 max-w-sm mx-auto space-y-4">
        <div>
          <label className="text-sm font-medium text-brand-800">Phone Number</label>
          <input
            className="input-field mt-1"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-brand-800">Password</label>
          <input
            className="input-field mt-1"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-sm text-brand-500">
          New user?{" "}
          <button type="button" className="text-brand-700 font-semibold underline" onClick={() => navigate("/register")}>
            Register here
          </button>
        </p>
      </form>
    </div>
  );
}