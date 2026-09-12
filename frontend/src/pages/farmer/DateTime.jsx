import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  Check,
  ArrowRight,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import { useBooking } from "../../context/BookingContext.jsx";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_WINDOWS = [
  {
    id: "FULL_DAY",
    label: "Full Day",
    description: "6 AM – 6 PM",
  },
  {
    id: "MORNING",
    label: "Morning",
    description: "6 AM – 12 PM",
  },
  {
    id: "AFTERNOON",
    label: "Afternoon",
    description: "12 PM – 6 PM",
  },
];

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return cells;
}

export default function DateTime() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();

  const today = useMemo(() => new Date(), []);

  const [view, setView] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const [selectedDay, setSelectedDay] = useState(
    draft.date ? new Date(draft.date).getDate() : null
  );

  const [timeWindow, setTimeWindow] = useState(
    draft.timeWindow || "MORNING"
  );

  const cells = buildMonthGrid(view.year, view.month);

  const monthLabel = new Date(
    view.year,
    view.month
  ).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  function changeMonth(delta) {
    setSelectedDay(null);

    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);

      return {
        year: d.getFullYear(),
        month: d.getMonth(),
      };
    });
  }

  function isPast(day) {
    if (!day) return false;

    const cellDate = new Date(view.year, view.month, day);

    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return cellDate < currentDate;
  }

  function handleNext() {
    const date = new Date(
      view.year,
      view.month,
      selectedDay
    );

    updateDraft({
      date: date.toISOString().slice(0, 10),
      timeWindow,
    });

    navigate("/farmer/location");
  }

  const selectedDateText = selectedDay
    ? new Date(
        view.year,
        view.month,
        selectedDay
      ).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "Select a date";

  return (
    <div className="min-h-screen bg-[#f6faf7] pb-28">

      {/* Header */}
      <Navbar title="Book Mandi Slot" />

      {/* Stepper */}
      <div className="px-5 pt-4">
        <StatusStepper total={4} current={1} />
      </div>

      {/* Heading */}
      <div className="px-5 pt-6">
        <div className="flex items-start gap-3">

          <div className="w-11 h-11 rounded-2xl bg-[#e6f4e9] flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 text-[#0d631b]" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0d631b]">
              Step 2 of 4
            </p>

            <h1 className="text-2xl font-bold text-[#12351a] mt-1">
              When do you want to sell?
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Choose your preferred date and time.
            </p>
          </div>

        </div>
      </div>

      {/* Calendar Card */}
      <div className="px-5 pt-6">
        <div className="bg-white rounded-3xl border border-[#dce9df] shadow-sm p-5">

          {/* Month Header */}
          <div className="flex items-center justify-between mb-5">

            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="w-10 h-10 rounded-xl bg-[#f2f7f3] flex items-center justify-center text-[#0d631b] hover:bg-[#e6f4e9] transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <p className="font-bold text-[#173d20]">
                {monthLabel}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Select available date
              </p>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="w-10 h-10 rounded-xl bg-[#f2f7f3] flex items-center justify-center text-[#0d631b] hover:bg-[#e6f4e9] transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-[11px] font-semibold text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="grid grid-cols-7 gap-y-2">

            {cells.map((day, index) => {
              const disabled = !day || isPast(day);
              const selected = day === selectedDay;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedDay(day)}
                  className={`mx-auto w-10 h-10 rounded-xl flex items-center justify-center text-sm transition ${
                    !day
                      ? "invisible"
                      : disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : selected
                      ? "bg-[#0d631b] text-white font-bold shadow-md"
                      : "text-[#173d20] hover:bg-[#e6f4e9]"
                  }`}
                >
                  {day}
                </button>
              );
            })}

          </div>

          {/* Selected Date */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#e6f4e9] flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-[#0d631b]" />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Selected date
              </p>

              <p className="text-sm font-bold text-[#173d20]">
                {selectedDateText}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Time Window */}
      <div className="px-5 pt-6">

        <div className="flex items-center gap-2 mb-3">
          <Clock3 className="w-5 h-5 text-[#0d631b]" />

          <h2 className="font-bold text-[#173d20]">
            Preferred Time
          </h2>
        </div>

        <div className="space-y-3">

          {TIME_WINDOWS.map((tw) => {
            const selected = timeWindow === tw.id;

            return (
              <button
                key={tw.id}
                type="button"
                onClick={() => setTimeWindow(tw.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 flex items-center justify-between transition ${
                  selected
                    ? "border-[#0d631b] bg-[#eef8f0]"
                    : "border-[#dce9df] bg-white hover:border-[#b9d6bf]"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selected
                        ? "bg-[#0d631b]"
                        : "bg-[#f1f5f2]"
                    }`}
                  >
                    <Clock3
                      className={`w-5 h-5 ${
                        selected
                          ? "text-white"
                          : "text-gray-500"
                      }`}
                    />
                  </div>

                  <div>
                    <p className="font-bold text-[#173d20]">
                      {tw.label}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {tw.description}
                    </p>
                  </div>

                </div>

                {selected && (
                  <div className="w-7 h-7 rounded-full bg-[#0d631b] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

              </button>
            );
          })}

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#dce9df] px-5 py-4 z-20">

        <div className="max-w-md mx-auto">

          <button
            type="button"
            disabled={!selectedDay}
            onClick={handleNext}
            className="w-full h-14 rounded-2xl bg-[#0d631b] hover:bg-[#095216] text-white font-bold flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
}