import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock3,
  CalendarCheck,
  ShieldCheck,
  Leaf,
  ArrowRight,
} from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fbf8] flex items-center justify-center px-4 py-6">

      {/* Main mobile-style application container */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-white rounded-[32px] shadow-xl overflow-hidden border border-[#dcebe1] flex flex-col">

        {/* Top branding */}
        <div className="px-7 pt-8">

          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-[#e5f6e9] flex items-center justify-center">
              <Leaf
                size={29}
                strokeWidth={2.5}
                className="text-[#087f35]"
              />
            </div>

            <h1 className="text-[28px] font-extrabold tracking-tight text-[#075d2b]">
              KisanProcure
            </h1>
          </div>

          <p className="mt-2 text-[13px] font-medium text-[#5d7064]">
            Sarkari Kharid, Ab Aapke Haath Mein
          </p>

        </div>

        {/* Farmer illustration / hero */}
        <div className="px-5 mt-6">

          <div className="relative h-[270px] rounded-[24px] overflow-hidden bg-gradient-to-b from-[#eaf7ef] to-[#cfead5]">

            {/* Decorative background */}
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#a9dfb5]/40" />
            <div className="absolute -bottom-20 -left-10 w-52 h-52 rounded-full bg-[#8fcfa0]/30" />

            {/* Farmer image */}
            <img
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=900&q=85"
              alt="Farmer"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            {/* Small trust badge */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck
                size={15}
                className="text-[#087f35]"
              />
              <span className="text-[11px] font-bold text-[#174d2c]">
                Trusted Procurement
              </span>
            </div>

            {/* Hero text */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-[12px] font-semibold uppercase tracking-wider opacity-90">
                Digital Mandi Platform
              </p>

              <h2 className="text-[25px] font-extrabold leading-tight mt-1">
                Right Centre.
                <br />
                Right Time.
              </h2>
            </div>

          </div>
        </div>

        {/* Feature section */}
        <div className="px-7 pt-6">

          <div className="space-y-4">

            <Feature
              icon={<MapPin size={19} />}
              text="Find nearby procurement centres"
            />

            <Feature
              icon={<Clock3 size={19} />}
              text="Check real-time availability"
            />

            <Feature
              icon={<CalendarCheck size={19} />}
              text="Book your procurement slot"
            />

            <Feature
              icon={<ShieldCheck size={19} />}
              text="Sell without uncertainty"
            />

          </div>

        </div>

        {/* Buttons */}
        <div className="mt-auto px-7 pb-7 pt-7">

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full h-[52px] rounded-xl bg-[#087f35] hover:bg-[#066b2c] text-white font-bold text-[15px] transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full h-[52px] rounded-xl border-2 border-[#087f35] text-[#075d2b] hover:bg-[#eff9f1] font-bold text-[15px] mt-3 transition-all duration-200"
          >
            Login
          </button>

          <p className="text-center text-[12px] text-[#6c7c72] mt-4">
            New user?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-[#087f35] underline underline-offset-2"
            >
              Register here
            </button>
          </p>

        </div>

      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-lg bg-[#e7f6eb] flex items-center justify-center text-[#087f35] flex-shrink-0">
        {icon}
      </div>

      <span className="text-[13px] font-semibold text-[#30473a]">
        {text}
      </span>

    </div>
  );
}