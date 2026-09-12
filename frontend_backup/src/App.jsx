// Main React application
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Welcome from "./pages/welcome.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

import Dashboard from "./pages/farmer/Dashboard.jsx";
import SelectCrop from "./pages/farmer/SelectCrop.jsx";
import DateTime from "./pages/farmer/DateTime.jsx";
import Location from "./pages/farmer/Location.jsx";
import Centres from "./pages/farmer/Centres.jsx";
import CentreDetails from "./pages/farmer/CentreDetails.jsx";
import Slots from "./pages/farmer/Slots.jsx";
import ConfirmBooking from "./pages/farmer/ConfirmBooking.jsx";
import BookingConfirmed from "./pages/farmer/BookingConfirmed.jsx";
import LiveQueue from "./pages/farmer/LiveQueue.jsx";
import BookingDetails from "./pages/farmer/BookingDetails.jsx";
import Payment from "./pages/farmer/Payment.jsx";

import OfficerDashboard from "./pages/officer/Dashboard.jsx";
import TodayQueue from "./pages/officer/TodayQueue.jsx";
import BookingProcess from "./pages/officer/BookingProcess.jsx";
import QualityCheck from "./pages/officer/QualityCheck.jsx";
import Weighment from "./pages/officer/Weighment.jsx";
import Reports from "./pages/officer/Reports.jsx";

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/farmer" element={<Protected role="FARMER"><Dashboard /></Protected>} />
      <Route path="/farmer/select-crop" element={<Protected role="FARMER"><SelectCrop /></Protected>} />
      <Route path="/farmer/date-time" element={<Protected role="FARMER"><DateTime /></Protected>} />
      <Route path="/farmer/location" element={<Protected role="FARMER"><Location /></Protected>} />
      <Route path="/farmer/centres" element={<Protected role="FARMER"><Centres /></Protected>} />
      <Route path="/farmer/centres/:id" element={<Protected role="FARMER"><CentreDetails /></Protected>} />
      <Route path="/farmer/centres/:id/slots" element={<Protected role="FARMER"><Slots /></Protected>} />
      <Route path="/farmer/confirm" element={<Protected role="FARMER"><ConfirmBooking /></Protected>} />
      <Route path="/farmer/bookings/:id/confirmed" element={<Protected role="FARMER"><BookingConfirmed /></Protected>} />
      <Route path="/farmer/bookings/:id/status" element={<Protected role="FARMER"><LiveQueue /></Protected>} />
      <Route path="/farmer/bookings/:id" element={<Protected role="FARMER"><BookingDetails /></Protected>} />
      <Route path="/farmer/bookings/:id/payment" element={<Protected role="FARMER"><Payment /></Protected>} />

      <Route path="/officer" element={<Protected role="OFFICER"><OfficerDashboard /></Protected>} />
      <Route path="/officer/queue" element={<Protected role="OFFICER"><TodayQueue /></Protected>} />
      <Route path="/officer/bookings/:id" element={<Protected role="OFFICER"><BookingProcess /></Protected>} />
      <Route path="/officer/bookings/:id/quality" element={<Protected role="OFFICER"><QualityCheck /></Protected>} />
      <Route path="/officer/bookings/:id/weighment" element={<Protected role="OFFICER"><Weighment /></Protected>} />
      <Route path="/officer/reports" element={<Protected role="OFFICER"><Reports /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}