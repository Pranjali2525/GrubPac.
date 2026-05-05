import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function getContentScheduleStatus(startTime, endTime) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

export function getScheduleStatusStyle(scheduleStatus) {
  switch (scheduleStatus) {
    case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
    case "expired": return "bg-gray-100 text-gray-500 border-gray-200";
    default: return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

export function getStatusStyle(status) {
  switch (status) {
    case "approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
    case "rejected": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-500";
  }
}

export function formatFileSize(bytes) {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}
