// Officer API
import api from "./api.js";

export function getDashboard() {
  return api.get("/api/officer/dashboard").then((r) => r.data);
}

export function getTodayQueue(date) {
  return api.get("/api/officer/queue/today", { params: date ? { date } : {} }).then((r) => r.data);
}

export function callNext(centreId) {
  return api.post("/api/officer/queue/next", { centreId }).then((r) => r.data);
}

export function submitQualityCheck(bookingId, payload) {
  return api.post(`/api/officer/bookings/${bookingId}/quality-check`, payload).then((r) => r.data);
}

export function submitWeighment(bookingId, payload) {
  return api.post(`/api/officer/bookings/${bookingId}/weighment`, payload).then((r) => r.data);
}

export function submitProcurement(bookingId, payload) {
  return api.post(`/api/officer/bookings/${bookingId}/procurement`, payload).then((r) => r.data);
}

export function updateBookingStatus(bookingId, status) {
  return api.patch(`/api/officer/bookings/${bookingId}/status`, { status }).then((r) => r.data);
}

export function getReports(from, to, centreId) {
  return api.get("/api/officer/reports", { params: { from, to, centre_id: centreId } }).then((r) => r.data);
}