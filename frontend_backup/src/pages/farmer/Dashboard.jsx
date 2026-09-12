// Farmer dashboard
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import BookingCard from "../../components/BookingCard.jsx";
import NotificationCard from "../../components/NotificationCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBooking } from "../../context/BookingContext.jsx";
import { getNotifications, markNotificationRead } from "../../services/notifications.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const { farmer, user } = useAuth();
  const { resetDraft, lastBooking } = useBooking();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotifications().then(setNotifications).catch(() => {});
  }, []);

  function startBooking() {
    resetDraft();
    navigate("/farmer/select-crop");
  }

  async function handleMarkRead(id) {
    await markNotificationRead(id, true).catch(() => {});
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      <Navbar title="KisanProcure" showBack={false} />

      <div className="px-6 pt-4">
        <h2 className="text-lg font-bold text-brand-900">Namaste, {user?.name}</h2>
        {farmer && <p className="text-sm text-brand-500">{farmer.village}, {farmer.district}</p>}
      </div>

      <button onClick={startBooking} className="mx-6 mt-5 w-[calc(100%-3rem)] rounded-2xl bg-brand-600 text-white p-5 flex items-center gap-3 text-left">
        <PlusCircle size={28} />
        <div>
          <p className="font-semibold">Book a New Slot</p>
          <p className="text-sm text-brand-100">Find a procurement centre and reserve capacity</p>
        </div>
      </button>

      {lastBooking && (
        <div className="px-6 pt-6">
          <h3 className="text-sm font-semibold text-brand-800 mb-2">Your Latest Booking</h3>
          <BookingCard booking={lastBooking} />
        </div>
      )}

      <div className="px-6 pt-6">
        <h3 className="text-sm font-semibold text-brand-800 mb-2">Notifications</h3>
        {notifications.length === 0 && <p className="text-sm text-brand-400">No notifications yet.</p>}
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      </div>
    </div>
  );
}