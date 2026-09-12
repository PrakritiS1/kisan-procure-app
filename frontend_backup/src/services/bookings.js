// Bookings API
import api from "./api.js";

export function createBooking(payload) {
  return api.post("/api/bookings", payload).then((r) => r.data);
}

export function getBooking(id) {
  return api.get(`/api/bookings/${id}`).then((r) => r.data.data);
}

export function getBookingQueue(id) {
  return api.get(`/api/bookings/${id}/queue`).then((r) => r.data);
}

export function checkIn(id, { checkInMethod = "APP", latitude = 0, longitude = 0 } = {}) {
  return api.post(`/api/bookings/${id}/check-in`, { checkInMethod, latitude, longitude }).then((r) => r.data);
}

export function cancelBooking(id, reason) {
  return api.patch(`/api/bookings/${id}/cancel`, { reason }).then((r) => r.data);
}