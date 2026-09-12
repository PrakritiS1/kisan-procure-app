// Auth API
import api from "./api.js";

export function login(phone, password) {
  return api.post("/api/auth/login", { phone, password }).then((r) => r.data);
}

export function register(payload) {
  return api.post("/api/auth/register", payload).then((r) => r.data);
}

export function me() {
  return api.get("/api/auth/me").then((r) => r.data);
}