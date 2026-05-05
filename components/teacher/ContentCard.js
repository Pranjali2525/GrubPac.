"use client";
import { Card, Badge } from "@/components/ui";
import { getStatusStyle, getContentScheduleStatus, getScheduleStatusStyle, formatDateTime } from "@/utils/helpers";

export default function ContentCard({ item, actions }) {
  const scheduleStatus = getContentScheduleStatus(item.startTime, item.endTime);

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      {/* Preview */}
      <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
        {item.fileUrl ? (
          <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📄</div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-2 right-2">
          <Badge className={getStatusStyle(item.status)}>{item.status}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.title}</h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 text-xs">{item.subject}</Badge>
          <Badge className={`${getScheduleStatusStyle(scheduleStatus)} text-xs`}>{scheduleStatus}</Badge>
        </div>

        {item.teacherName && (
          <p className="text-xs text-gray-400">By {item.teacherName}</p>
        )}

        <div className="text-xs text-gray-400 space-y-0.5">
          <p>Start: {formatDateTime(item.startTime)}</p>
          <p>End: {formatDateTime(item.endTime)}</p>
        </div>

        {item.status === "rejected" && item.rejectionReason && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            <p className="text-xs text-red-600 font-medium">Rejection reason:</p>
            <p className="text-xs text-red-500">{item.rejectionReason}</p>
          </div>
        )}
      </div>

      {actions && <div className="mt-4 pt-3 border-t border-gray-100">{actions}</div>}
    </Card>
  );
}
