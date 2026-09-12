// Notification card component
import { Bell } from "lucide-react";

export default function NotificationCard({ notification, onMarkRead }) {
  return (
    <button
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
      className={`w-full text-left flex gap-3 px-4 py-3 rounded-xl ${notification.isRead ? "bg-white" : "bg-brand-50"}`}
    >
      <Bell className={notification.isRead ? "text-brand-300" : "text-brand-600"} size={18} />
      <div>
        <p className="text-sm font-medium text-brand-900">{notification.title}</p>
        <p className="text-xs text-brand-500">{notification.message}</p>
      </div>
    </button>
  );
}