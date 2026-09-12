// Date and time selection
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft as PrevIcon, ChevronRight as NextIcon } from "lucide-react";
import Navbar from "../../components/Navbar.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import { useBooking } from "../../context/BookingContext.jsx";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_WINDOWS = [
  { id: "FULL_DAY", label: "Full Day" },
  { id: "MORNING", label: "Morning (6 AM – 12 PM)" },
  { id: "AFTERNOON", label: "Afternoon (12 PM – 6 PM)" },
];

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function DateTime() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(draft.date ? new Date(draft.date).getDate() : null);
  const [timeWindow, setTimeWindow] = useState(draft.timeWindow || "MORNING");

  const cells = buildMonthGrid(view.year, view.month);
  const monthLabel = new Date(view.year, view.month).toLocaleString("en-IN", { month: "long", year: "numeric" });

  function changeMonth(delta) {
    setSelectedDay(null);
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function isPast(day) {
    if (!day) return false;
    const cellDate = new Date(view.year, view.month, day);
    const cmp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return cellDate < cmp;
  }

  function handleNext() {
    const date = new Date(view.year, view.month, selectedDay);
    updateDraft({ date: date.toISOString().slice(0, 10), timeWindow });
    navigate("/farmer/location");
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar title="Preferred Date & Time" />
      <StatusStepper total={4} current={1} />
      <div className="px-6 pt-4">
        <h2 className="text-xl font-bold text-brand-900">Select when you want to sell</h2>
      </div>

      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => changeMonth(-1)} className="text-brand-600"><PrevIcon size={20} /></button>
          <span className="font-semibold text-brand-900">{monthLabel}</span>
          <button onClick={() => changeMonth(1)} className="text-brand-600"><NextIcon size={20} /></button>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-brand-400 mb-2">
          {WEEKDAYS.map((w) => <div key={w}>{w}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {cells.map((day, i) => {
            const disabled = !day || isPast(day);
            const selected = day === selectedDay;
            return (
              <button
                key={i}
                disabled={disabled}
                onClick={() => setSelectedDay(day)}
                className={`h-9 rounded-full text-sm flex items-center justify-center ${
                  !day ? "invisible" : disabled ? "text-brand-200" : selected ? "bg-brand-600 text-white font-semibold" : "text-brand-800 hover:bg-brand-50"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pt-6">
        <h3 className="text-sm font-semibold text-brand-800 mb-2">Preferred Time Window</h3>
        <div className="space-y-2">
          {TIME_WINDOWS.map((tw) => (
            <label
              key={tw.id}
              className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer ${
                timeWindow === tw.id ? "border-brand-600 bg-brand-50" : "border-brand-100"
              }`}
            >
              <input type="radio" name="timeWindow" className="accent-brand-600" checked={timeWindow === tw.id} onChange={() => setTimeWindow(tw.id)} />
              <span className="text-sm text-brand-800">{tw.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 px-6 py-4 max-w-md mx-auto">
        <button className="btn-primary" disabled={!selectedDay} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}