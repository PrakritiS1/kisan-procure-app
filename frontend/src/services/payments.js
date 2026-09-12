// Payments API
import api from "./api.js";

export function createPayment(payload) {
  return api.post("/api/payments", payload).then((r) => r.data);
}

export function getPayment(id) {
  return api.get(`/api/payments/${id}`).then((r) => r.data);
}