// AI API
import api from "./api.js";

export function predictWaitTime(payload) {
  return api.post("/ai/predict-wait-time", payload).then((r) => r.data);
}

export function recommendCentres(payload) {
  return api.post("/ai/recommend-centres", payload).then((r) => r.data);
}