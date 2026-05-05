"use client";
import { cn } from "@/utils/helpers";

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", loading, className, disabled, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-300",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, className, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <input className={cn("w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent", error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300", className)} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <textarea className={cn("w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none", error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300", className)} rows={3} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className, required, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select className={cn("w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white", error ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300", className)} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, className }) {
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>{children}</span>;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, ...props }) {
  return <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm", className)} {...props}>{children}</div>;
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = "md", className }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" };
  return <div className={cn("animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600", sizes[size], className)} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-5xl mb-4 opacity-30">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-600 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse bg-gray-200 rounded-xl", className)} />;
}

export function SkeletonCard() {
  return (
    <Card className="p-5">
      <Skeleton className="h-5 w-1/3 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, className }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto", className)}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xl">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
export function StatsCard({ title, value, icon, color = "indigo", loading }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0", colors[color])}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        {loading ? <Skeleton className="h-7 w-16 mt-1" /> : <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>}
      </div>
    </Card>
  );
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };
  const icons = { error: "⚠️", success: "✅", info: "ℹ️" };
  return (
    <div className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border text-sm", styles[type])}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
