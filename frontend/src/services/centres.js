// Centres API
import api from "./api.js";

export function getNearbyCentres({ latitude, longitude, radius = 10, cropId }) {
  return api
    .get("/api/centres/nearby", { params: { latitude, longitude, radius, cropId } })
    .then((r) => r.data.centres);
}

export function getCentreDetails(id, { latitude = 0, longitude = 0 } = {}) {
  return api.get(`/api/centres/${id}`, { params: { latitude, longitude } }).then((r) => r.data.data.centre);
}

export function getCentreCapacity(id) {
  return api.get(`/api/centres/${id}/capacity`).then((r) => r.data);
}

export function getCentreSlots(id, { date, cropId, quantity }) {
  return api.get(`/api/centres/${id}/slots`, { params: { date, cropId, quantity } }).then((r) => r.data);
}