// Booking state context
import { createContext, useContext, useState, useCallback } from "react";

const BookingContext = createContext(null);

const initialDraft = {
  cropId: null,
  cropName: "",
  quantity: "",
  date: null,
  timeWindow: null, // 'FULL_DAY' | 'MORNING' | 'AFTERNOON'
  latitude: null,
  longitude: null,
  radiusKm: 10,
  centreId: null,
  centreName: "",
  slotId: null,
  slotLabel: "",
};

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(initialDraft);
  const [lastBooking, setLastBooking] = useState(null);

  const updateDraft = useCallback((patch) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(initialDraft), []);

  return (
    <BookingContext.Provider value={{ draft, updateDraft, resetDraft, lastBooking, setLastBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}