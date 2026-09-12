import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wheat,
  Leaf,
  Sprout,
  Package,
  ArrowRight,
  Scale,
  Check,
} from "lucide-react";

import Navbar from "../../components/Navbar.jsx";
import StatusStepper from "../../components/StatusStepper.jsx";
import CropCard from "../../components/CropCard.jsx";
import { getCrops } from "../../services/crops.js";
import { useBooking } from "../../context/BookingContext.jsx";

export default function SelectCrop() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useBooking();

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(draft.quantity || "");

  useEffect(() => {
    getCrops()
      .then(setCrops)
      .catch(() =>
        setError("Could not load crops. Is the backend running?")
      )
      .finally(() => setLoading(false));
  }, []);

  function selectCrop(crop) {
    updateDraft({
      cropId: crop.id,
      cropName: crop.name,
      cropUnit: crop.unit,
    });
  }

  function handleNext() {
    updateDraft({ quantity: Number(quantity) });
    navigate("/farmer/date-time");
  }

  const canProceed = draft.cropId && Number(quantity) > 0;

  return (
    <div className="min-h-screen bg-[#f6faf7] pb-28">

      {/* Header */}
      <Navbar title="Book Mandi Slot" />

      {/* Stepper */}
      <div className="px-5 pt-4">
        <StatusStepper total={4} current={0} />
      </div>

      {/* Heading */}
      <div className="px-5 pt-6">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#e6f4e9] flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6 text-[#0d631b]" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0d631b]">
              Step 1 of 4
            </p>

            <h1 className="text-2xl font-bold text-[#12351a] mt-1">
              What are you selling?
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Select the crop you want to bring to the mandi.
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="px-5 pt-8 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 rounded-2xl bg-white border border-[#dce9df] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-5 mt-6 rounded-2xl bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Real crops from API */}
      {!loading && !error && (
        <div className="px-5 pt-6">

          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#173d20]">
              Available Crops
            </h2>

            <span className="text-xs text-gray-400">
              {crops.length} available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className={`relative rounded-2xl transition ${
                  draft.cropId === crop.id
                    ? "ring-2 ring-[#0d631b] ring-offset-2"
                    : ""
                }`}
              >
                <CropCard
                  crop={crop}
                  selected={draft.cropId === crop.id}
                  onSelect={selectCrop}
                />

                {draft.cropId === crop.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0d631b] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="px-5 pt-7">
        <div className="bg-white rounded-3xl border border-[#dce9df] p-5">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#eff4ff] flex items-center justify-center">
              <Scale className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h2 className="font-bold text-[#173d20]">
                Expected Quantity
              </h2>

              <p className="text-xs text-gray-500">
                Approximate quantity you will bring
              </p>
            </div>
          </div>

          <div className="flex gap-2">

            <input
              className="flex-1 h-14 rounded-2xl border border-[#cfe3d4] bg-[#fbfdfb] px-4 text-[#173d20] outline-none focus:border-[#0d631b] focus:ring-2 focus:ring-[#d7eadb]"
              type="number"
              min="1"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <div className="min-w-[90px] h-14 rounded-2xl bg-[#e9f6ec] text-[#0d631b] flex items-center justify-center font-bold text-sm">
              {draft.cropUnit || "quintal"}
            </div>

          </div>

          {draft.cropName && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#0d631b]">
              <Leaf className="w-4 h-4" />
              <span>
                Selected: <strong>{draft.cropName}</strong>
              </span>
            </div>
          )}

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#dce9df] px-5 py-4 z-20">

        <div className="max-w-md mx-auto">

          <button
            disabled={!canProceed}
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