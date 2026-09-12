// Live queue
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import { getBooking, getBookingQueue, checkIn } from "../../services/bookings.js";

const STEPS = ["Scheduled", "Checked In", "Quality Check", "Weighment", "Procurement", "Payment Initiated"];

// booking.status -> index of the step currently in progress
const STATUS_STEP = {
  BOOKED: 0,
  CHECKED_IN: 1,
  WAITING: 1,
  QUALITY_CHECK: 2,
  WEIGHMENT: 3,
  PROCUREMENT: 4,
  COMPLETED: 5,
};

export default function LiveQueue() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const b = await getBooking(id);
      setBooking(b);
      if (b.status === "WAITING" || b.status === "QUALITY_CHECK") {
        const q = await getBookingQueue(id).catch(() => null);
        setQueue(q);
      }
    } catch {
      setError("Couldn't load booking status.");
    }
  }, [id]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 8000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function handleCheckIn() {
    setCheckingIn(true);
    try {
      navigator.geolocation?.getCurrentPosition(
        async (pos) => {
          await checkIn(id, { checkInMethod: "APP", latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          await refresh();
          setCheckingIn(false);
        },
        async () => {
          await checkIn(id, { checkInMethod: "APP" });
          await refresh();
          setCheckingIn(false);
        }
      );
    } catch {
      setError("Check-in failed.");
      setCheckingIn(false);
    }
  }

  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  if (!booking) return <div className="p-6 text-sm text-brand-500">Loading...</div>;

  if (booking.status === "CANCELLED") {
    return (
      <div className="min-h-screen bg-white">
        <Navbar title="Live Status" />
        <p className="px-6 py-8 text-sm text-red-600">This booking was cancelled.</p>
      </div>
    );
  }

  const currentStep = STATUS_STEP[booking.status] ?? 0;

  return (
    <div className="min-h-screen bg-white pb-8">
      <Navbar title="Live Status (On Booking Day)" />

      <div className="px-6 pt-4">
        {queue && (
          <div className="rounded-xl bg-brand-50 p-4 mb-4 text-sm text-brand-800">
            <p>Queue position: <strong>{queue.queuePosition}</strong> · {queue.peopleAhead} ahead</p>
            <p className="mt-1">Estimated wait: <strong>{queue.estimatedWaitMinutes} min</strong></p>
          </div>
        )}

        <ol className="space-y-5">
          {STEPS.map((step, i) => {
            const done = i < currentStep || booking.status === "COMPLETED";
            const active = i === currentStep && booking.status !== "COMPLETED";
            return (
              <li key={step} className="flex items-start gap-3">
                {done ? (
                  <CheckCircle2 className="text-brand-600 shrink-0" size={22} />
                ) : active ? (
                  <Loader2 className="text-brand-600 shrink-0 animate-spin" size={22} />
                ) : (
                  <Circle className="text-brand-200 shrink-0" size={22} />
                )}
                <div>
                  <p className={`text-sm font-medium ${done || active ? "text-brand-900" : "text-brand-400"}`}>{step}</p>
                  <p className="text-xs text-brand-400">{done ? "Done" : active ? "In Progress" : "Pending"}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {booking.status === "BOOKED" && (
          <button className="btn-primary mt-8" disabled={checkingIn} onClick={handleCheckIn}>
            {checkingIn ? "Checking in..." : "Check In"}
          </button>
        )}

        <p className="text-center text-xs text-brand-400 mt-6">You'll be notified at each step.</p>
      </div>
    </div>
  );
}