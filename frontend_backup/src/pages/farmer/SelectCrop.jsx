// Crop selection
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      .catch(() => setError("Could not load crops. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  function selectCrop(crop) {
    updateDraft({ cropId: crop.id, cropName: crop.name, cropUnit: crop.unit });
  }

  function handleNext() {
    updateDraft({ quantity: Number(quantity) });
    navigate("/farmer/date-time");
  }

  const canProceed = draft.cropId && Number(quantity) > 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Navbar title="Select Crop" />
      <StatusStepper total={4} current={0} />
      <div className="px-6 pt-4">
        <h2 className="text-xl font-bold text-brand-900">What are you selling?</h2>
      </div>

      {loading && <p className="px-6 py-8 text-brand-500 text-sm">Loading crops...</p>}
      {error && <p className="px-6 py-4 text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-3 gap-3 px-6 py-4">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} selected={draft.cropId === crop.id} onSelect={selectCrop} />
          ))}
        </div>
      )}

      <div className="px-6 pt-2">
        <label className="text-sm font-medium text-brand-800">Expected Quantity</label>
        <div className="flex gap-2 mt-1">
          <input
            className="input-field flex-1"
            type="number"
            min="1"
            placeholder="Enter approximate quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <span className="flex items-center px-3 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium">
            {draft.cropUnit || "quintal"}
          </span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-100 px-6 py-4 max-w-md mx-auto">
        <button className="btn-primary" disabled={!canProceed} onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}