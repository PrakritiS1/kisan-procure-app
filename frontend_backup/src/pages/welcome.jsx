import { useNavigate } from "react-router-dom";
import { Leaf, MapPin, Clock, CalendarCheck, ShieldCheck } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8 text-center">
        <div className="flex items-center gap-2 mb-1">
          <Leaf className="text-brand-600" size={32} />
          <h1 className="text-3xl font-extrabold text-brand-900">KisanProcure</h1>
        </div>
        <p className="text-brand-500 text-sm mb-10">Sarkari Kharid, Ab Aapke Haath Mein</p>

        <div className="w-full max-w-xs space-y-4 text-left mb-10">
          <Feature icon={<MapPin size={18} />} text="Find nearby procurement centres" />
          <Feature icon={<Clock size={18} />} text="Check real-time availability" />
          <Feature icon={<CalendarCheck size={18} />} text="Book your slot" />
          <Feature icon={<ShieldCheck size={18} />} text="Sell without uncertainty" />
        </div>
      </div>

      <div className="px-6 pb-10 w-full max-w-xs mx-auto space-y-3">
        <button className="btn-primary" onClick={() => navigate("/register")}>Get Started</button>
        <button className="btn-secondary" onClick={() => navigate("/login")}>Login</button>
        <p className="text-center text-sm text-brand-500">
          New user?{" "}
          <button className="text-brand-700 font-semibold underline" onClick={() => navigate("/register")}>
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-brand-800">
      <span className="text-brand-600">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}