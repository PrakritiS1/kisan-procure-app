import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Globe2,
  Bell,
  MapPin,
  Sprout,
  CalendarPlus,
  Radio,
  CreditCard,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Tractor,
  Building2,
  Wheat,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import {
  getNotifications,
  markNotificationRead,
} from "../../services/notifications.js";

export default function Dashboard() {
  const navigate = useNavigate();

  const { farmer, user, logout } = useAuth();
  const { resetDraft, lastBooking } = useBooking();

  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .catch(() => { });
  }, []);

  function startBooking() {
    resetDraft();
    navigate("/farmer/select-crop");
  }

  async function handleMarkRead(id) {
    await markNotificationRead(id, true).catch(() => { });

    setNotifications((list) =>
      list.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  }

  const farmerName = user?.name || farmer?.name || "Farmer";

  const location =
    [farmer?.village, farmer?.district]
      .filter(Boolean)
      .join(", ") || "Your location";

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#12351a]">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#dce8de]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 rounded-xl border border-[#dce8de] flex items-center justify-center hover:bg-[#f1f7f2]"
            >
              <Menu size={24} />
            </button>

            <div className="hidden sm:block">
              <p className="font-extrabold text-xl text-[#0d631b]">
                AgriConnect
              </p>
              <p className="text-xs text-gray-500">
                Mandi Terminal
              </p>
            </div>

          </div>

          {/* FARMER / OFFICER TOGGLE */}
          <div className="hidden md:flex bg-[#eff4ff] rounded-full p-1 border border-[#d8e2f4]">

            <button className="px-6 py-2.5 rounded-full bg-[#0d631b] text-white font-bold text-sm">
              Farmer View
            </button>

            <button
              onClick={() => navigate("/officer")}
              className="px-6 py-2.5 rounded-full text-gray-600 font-semibold text-sm hover:text-[#0d631b]"
            >
              Officer Portal
            </button>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-[#cddbeb] bg-[#f5f8ff]">
              <span className="font-bold text-[#0d631b]">EN</span>
              <span className="text-gray-600">हिन्दी</span>
            </button>

            <button className="hidden sm:flex w-11 h-11 rounded-xl items-center justify-center hover:bg-gray-100">
              <Globe2 size={21} />
            </button>

            <button className="relative w-11 h-11 rounded-xl flex items-center justify-center hover:bg-gray-100">
              <Bell size={22} />

              {notifications.some((n) => !n.isRead) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">

              <div className="text-right">
                <p className="font-bold text-sm">
                  {farmerName}
                </p>

                <p className="text-xs text-gray-500">
                  Farmer
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#d9f1dd] border-2 border-[#0d631b] flex items-center justify-center">
                <Sprout
                  size={25}
                  className="text-[#0d631b]"
                />
              </div>

            </div>

          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-2">

            <button
              onClick={startBooking}
              className="w-full text-left px-4 py-3 rounded-xl bg-[#0d631b] text-white font-semibold"
            >
              Book New Slot
            </button>

            <button
              onClick={() => navigate("/farmer")}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100"
            >
              Farmer Dashboard
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        )}
      </header>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 py-7">


        {/* ================= FARMER PROFILE ================= */}
        <section className="bg-gradient-to-r from-white via-[#f5fff4] to-[#efffee] border border-[#dbe9dc] rounded-[28px] p-5 md:p-7 shadow-sm">

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            {/* PROFILE */}
            <div className="flex items-center gap-5">

              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#dff1e2] border-4 border-white shadow flex items-center justify-center">
                <Sprout
                  size={42}
                  className="text-[#0d631b]"
                />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl md:text-3xl font-extrabold">
                    {farmerName}
                  </h1>

                  <span className="inline-flex items-center gap-1.5 bg-[#b9f3bb] text-[#075d16] px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold">
                    <ShieldCheck size={17} />
                    Aadhaar Verified
                  </span>

                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">

                  <span className="flex items-center gap-2">
                    <MapPin
                      size={18}
                      className="text-[#0d631b]"
                    />
                    {location}
                  </span>

                  <span className="flex items-center gap-2">
                    <Building2
                      size={18}
                      className="text-[#0d631b]"
                    />
                    Procurement Farmer
                  </span>

                  {farmer?.phone && (
                    <span>
                      📱 {farmer.phone}
                    </span>
                  )}

                </div>

              </div>
            </div>


            {/* FARMER DETAILS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              <div className="bg-white rounded-2xl border border-[#dbe9dc] px-4 py-3 min-w-[120px]">
                <p className="text-xs text-gray-500">
                  Farmer ID
                </p>

                <p className="font-bold mt-1">
                  {farmer?.id || user?.id || "—"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#dbe9dc] px-4 py-3 min-w-[120px]">
                <p className="text-xs text-gray-500">
                  Village
                </p>

                <p className="font-bold mt-1 truncate">
                  {farmer?.village || "—"}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#dbe9dc] px-4 py-3 min-w-[120px]">
                <p className="text-xs text-gray-500">
                  District
                </p>

                <p className="font-bold mt-1 truncate">
                  {farmer?.district || "—"}
                </p>
              </div>

            </div>

          </div>


          {/* ACTIVE TOKEN */}
          {lastBooking && (
            <div className="mt-6 bg-[#eff4ff] border border-[#d6e2f5] rounded-2xl p-4 md:p-5">

              <div className="grid md:grid-cols-4 gap-4 items-center">

                <div>
                  <p className="text-xs font-bold tracking-wide text-gray-500">
                    ACTIVE BOOKING
                  </p>

                  <p className="text-2xl md:text-3xl font-extrabold text-[#0d631b]">
                    #{lastBooking.id}
                  </p>
                </div>


                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Crop
                  </p>

                  <p className="font-bold">
                    {lastBooking.crop || "—"}
                  </p>
                </div>


                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500">
                    Quantity
                  </p>

                  <p className="font-bold">
                    {lastBooking.quantity
                      ? `${lastBooking.quantity} qtl`
                      : "—"}
                  </p>
                </div>


                <div className="flex flex-col sm:flex-row md:flex-col gap-2">

                  <span className="inline-flex items-center justify-center gap-2 bg-[#0d631b] text-white px-4 py-2 rounded-xl font-bold text-sm">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    {lastBooking.status || "Booked"}
                  </span>

                  <button
                    onClick={() =>
                      navigate(
                        `/farmer/bookings/${lastBooking.id}/status`
                      )
                    }
                    className="bg-white border border-[#d6e2f5] rounded-xl px-4 py-2 font-bold text-[#0d631b] flex items-center justify-center gap-2 hover:bg-[#f7fbff]"
                  >
                    Track Live
                    <ArrowRight size={18} />
                  </button>

                </div>

              </div>
            </div>
          )}

        </section>


        {/* ================= QUICK ACTIONS ================= */}
        <section className="mt-8">

          <div className="flex items-center justify-between mb-4">

            <h2 className="text-xl md:text-2xl font-extrabold">
              Quick Actions
            </h2>

            <span className="text-sm text-gray-500">
              किसान सेवाएँ
            </span>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* BOOK SLOT */}
            <button
              onClick={startBooking}
              className="text-left bg-[#0d631b] text-white rounded-2xl p-5 min-h-[145px] hover:bg-[#095216] transition shadow-sm"
            >

              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                <CalendarPlus size={25} />
              </div>

              <p className="font-extrabold text-lg">
                Book Slot
              </p>

              <p className="text-sm text-green-100 mt-1">
                नया स्लॉट बुक करें
              </p>

            </button>


            {/* LIVE QUEUE */}
            <button
              onClick={() =>
                lastBooking &&
                navigate(
                  `/farmer/bookings/${lastBooking.id}/status`
                )
              }
              className="text-left bg-white border border-[#dce8de] rounded-2xl p-5 min-h-[145px] hover:shadow-md transition"
            >

              <div className="w-12 h-12 rounded-xl bg-[#e8f5ea] text-[#0d631b] flex items-center justify-center mb-5">
                <Radio size={25} />
              </div>

              <p className="font-extrabold text-lg">
                Live Queue
              </p>

              <p className="text-sm text-gray-500 mt-1">
                ट्रैक्टर टोकन स्थिति
              </p>

            </button>


            {/* PAYMENT */}
            <button
              onClick={() =>
                lastBooking &&
                navigate(
                  `/farmer/bookings/${lastBooking.id}/payment`
                )
              }
              className="text-left bg-white border border-[#dce8de] rounded-2xl p-5 min-h-[145px] hover:shadow-md transition"
            >

              <div className="w-12 h-12 rounded-xl bg-[#e9f0ff] text-[#1557b0] flex items-center justify-center mb-5">
                <CreditCard size={25} />
              </div>

              <p className="font-extrabold text-lg">
                Payment Status
              </p>

              <p className="text-sm text-gray-500 mt-1">
                डीबीटी भुगतान जांचें
              </p>

            </button>


            {/* GUIDELINES */}
            <button
              onClick={startBooking}
              className="text-left bg-white border border-[#dce8de] rounded-2xl p-5 min-h-[145px] hover:shadow-md transition"
            >

              <div className="w-12 h-12 rounded-xl bg-[#fff3df] text-[#d87500] flex items-center justify-center mb-5">
                <Leaf size={25} />
              </div>

              <p className="font-extrabold text-lg">
                Crop Guidelines
              </p>

              <p className="text-sm text-gray-500 mt-1">
                नमी व गुणवत्ता मानक
              </p>

            </button>

          </div>
        </section>


        {/* ================= BOOK NEW SLOT BANNER ================= */}
        <button
          onClick={startBooking}
          className="mt-6 w-full bg-[#0d631b] hover:bg-[#095216] text-white rounded-2xl p-5 md:p-6 flex items-center justify-between transition shadow-sm"
        >

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              <CalendarPlus size={29} />
            </div>

            <div className="text-left">

              <p className="text-xl font-extrabold">
                Book a New Slot
              </p>

              <p className="text-sm text-green-100 mt-1">
                Find a procurement centre and reserve capacity
              </p>

            </div>

          </div>

          <ArrowRight size={28} />

        </button>


        {/* ================= LATEST BOOKING ================= */}
        {lastBooking && (
          <section className="mt-8">

            <h2 className="text-xl font-extrabold mb-4">
              Recent Booking
            </h2>

            <button
              onClick={() =>
                navigate(`/farmer/bookings/${lastBooking.id}`)
              }
              className="w-full bg-white border border-[#dce8de] rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition text-left"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-xl bg-[#e9f5ea] flex items-center justify-center">
                  <Wheat
                    size={24}
                    className="text-[#0d631b]"
                  />
                </div>

                <div>

                  <p className="font-bold">
                    {lastBooking.booking ||
                      `Booking #${lastBooking.id}`}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {lastBooking.crop || "Crop"}{" "}
                    {lastBooking.quantity
                      ? `· ${lastBooking.quantity} qtl`
                      : ""}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <span className="px-3 py-1.5 rounded-full bg-[#e8f5ea] text-[#0d631b] text-xs font-bold">
                  {lastBooking.status || "Booked"}
                </span>

                <ArrowRight
                  size={20}
                  className="text-[#0d631b]"
                />

              </div>

            </button>

          </section>
        )}


        {/* ================= NOTIFICATIONS ================= */}
        <section className="mt-8">

          <div className="flex items-center gap-2 mb-4">

            <Bell
              size={21}
              className="text-[#0d631b]"
            />

            <h2 className="text-xl font-extrabold">
              Notifications
            </h2>

          </div>


          {notifications.length === 0 ? (

            <div className="bg-white border border-[#dce8de] rounded-2xl p-6 text-center">
              <Bell
                size={28}
                className="mx-auto text-gray-300 mb-2"
              />

              <p className="text-sm text-gray-500">
                No notifications yet.
              </p>
            </div>

          ) : (

            <div className="space-y-3">

              {notifications.map((notification) => (

                <button
                  key={notification.id}
                  onClick={() =>
                    !notification.isRead &&
                    handleMarkRead(notification.id)
                  }
                  className={`w-full text-left bg-white border rounded-2xl p-4 flex gap-4 transition ${notification.isRead
                      ? "border-[#e1e8e2]"
                      : "border-[#b9dcbc] bg-[#f5fff5]"
                    }`}
                >

                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#e9f5ea] flex items-center justify-center">
                    <Bell
                      size={20}
                      className="text-[#0d631b]"
                    />
                  </div>

                  <div className="flex-1">

                    <p className="font-bold">
                      {notification.title}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>

                  </div>

                  {!notification.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-2" />
                  )}

                </button>

              ))}

            </div>

          )}

        </section>


        {/* ================= FOOTER ================= */}
        <footer className="py-10 text-center">

          <div className="flex items-center justify-center gap-2 text-[#0d631b] font-bold">
            <Tractor size={19} />
            AgriConnect
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Digital procurement for a stronger tomorrow
          </p>

        </footer>

      </main>
    </div>
  );
}