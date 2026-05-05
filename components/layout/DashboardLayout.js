"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/helpers";
import toast from "react-hot-toast";

const teacherNav = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/teacher/upload", label: "Upload Content", icon: "📤" },
  { href: "/teacher/my-content", label: "My Content", icon: "📁" },
];

const principalNav = [
  { href: "/principal/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/principal/approvals", label: "Pending Approvals", icon: "⏳" },
  { href: "/principal/all-content", label: "All Content", icon: "📋" },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const navItems = user?.role === "teacher" ? teacherNav : principalNav;

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">📡</div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">EduBroadcast</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role} Portal</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
              {user?.name?.[0] || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150", active ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}>
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150">
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium capitalize">
                {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block"></span>
              Online
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
