// Booking/procurement status stepper
export default function StatusStepper({ total, current }) {
  return (
    <div className="flex items-center justify-center gap-2 px-8 py-3 bg-white">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className={`h-2.5 w-2.5 rounded-full ${i <= current ? "bg-brand-600" : "bg-brand-100"}`} />
          {i < total - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < current ? "bg-brand-600" : "bg-brand-100"}`} />
          )}
        </div>
      ))}
    </div>
  );
}