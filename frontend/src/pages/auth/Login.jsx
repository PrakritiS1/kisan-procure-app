import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { Phone, Lock, ArrowRight, Sprout } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // KEEPING ORIGINAL LOGIN LOGIC
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
      setError(
        err.response?.data?.message || "Invalid phone or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] flex flex-col">

      {/* Top Header */}
      <Navbar title="Login" />

      <main className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">

          {/* Logo / Heading */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#0d631b] flex items-center justify-center shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-[#12351a]">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to manage your mandi bookings
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-[#dce9df] shadow-sm p-6">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[#173d20] mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0d631b]" />

                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-[#cfe3d4] bg-[#fbfdfb] outline-none transition focus:border-[#0d631b] focus:ring-2 focus:ring-[#d7eadb]"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#173d20] mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0d631b]" />

                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-[#cfe3d4] bg-[#fbfdfb] outline-none transition focus:border-[#0d631b] focus:ring-2 focus:ring-[#d7eadb]"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <button
                className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}

                {!loading && (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </form>

            {/* Register */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                New to AgriConnect?
              </p>

              <button
                type="button"
                className="mt-1 text-[#0d631b] font-bold hover:underline"
                onClick={() => navigate("/register")}
              >
                Create an account
              </button>
            </div>

          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Secure access for farmers and mandi officers
          </p>

        </div>
      </main>
    </div>
  );
}