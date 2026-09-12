// Navbar component
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title, showBack = true, right = null }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-brand-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 w-8">
        {showBack && (
          <button onClick={() => navigate(-1)} aria-label="Go back" className="text-brand-800 hover:text-brand-600">
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <h1 className="text-base font-semibold text-brand-900">{title}</h1>
      <div className="w-8 flex justify-end">{right}</div>
    </header>
  );
}