// Notifications API
import api from "./api.js";

export function getNotifications() {
  return api.get("/api/notifications").then((r) => r.data.notifications);
}

export function markNotificationRead(id, isRead = true) {
  return api.patch(`/api/notifications/${id}/read`, { isRead }).then((r) => r.data);
}