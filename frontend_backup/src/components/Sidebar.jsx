// Sidebar component
import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListOrdered, FileBarChart, LogOut, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const LINKS = [
  { to: "/officer", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/officer/queue", label: "Today's Queue", icon: ListOrdered },
  { to: "/officer/reports", label: "Reports", icon: FileBarChart },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="w-60 shrink-0 bg-brand-800 text-white min-h-screen flex flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <Leaf size={22} />
        <span className="font-bold text-lg">KisanProcure</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm ${
                isActive ? "bg-brand-600 text-white" : "text-brand-100 hover:bg-brand-700"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-brand-700">
        <p className="text-sm font-medium">{user?.name}</p>
        <p className="text-xs text-brand-300 mb-3">Officer</p>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-brand-200 hover:text-white">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}