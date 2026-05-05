"use client";
import { use } from "react";
import { usePolling } from "@/hooks/useData";
import contentService from "@/services/content.service";
import { Spinner, Badge } from "@/components/ui";
import { getContentScheduleStatus } from "@/utils/helpers";

export default function LivePage({ params }) {
  const { teacherId } = use(params);

  // Auto-refresh every 30 seconds
  const { data, loading, error } = usePolling(
    () => contentService.getLiveContent(teacherId),
    30000,
    [teacherId]
  );

  const items = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg">📡</div>
            <div>
              <p className="font-bold text-white">EduBroadcast</p>
              <p className="text-xs text-gray-400">Live Content</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-gray-300">LIVE</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner size="lg" className="border-gray-600 border-t-indigo-400" />
            <p className="text-gray-400">Loading live content…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-6xl mb-4 opacity-30">⚠️</div>
            <h2 className="text-xl font-bold text-gray-300 mb-2">Unable to load content</h2>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-3xl flex items-center justify-center text-5xl mb-6 opacity-40">📺</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">No content available</h2>
            <p className="text-gray-500 text-sm">There is currently no active broadcast. Please check back later.</p>
            <p className="text-xs text-gray-600 mt-4">Auto-refreshes every 30 seconds</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Currently Broadcasting</h1>
              <span className="text-xs text-gray-500">{items.length} active item{items.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <LiveContentCard key={item.id} item={item} />
              ))}
            </div>

            <p className="text-center text-xs text-gray-600">Auto-refreshes every 30 seconds</p>
          </div>
        )}
      </main>
    </div>
  );
}

function LiveContentCard({ item }) {
  const scheduleStatus = getContentScheduleStatus(item.startTime, item.endTime);

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors">
      {/* Image */}
      <div className="w-full h-56 bg-gray-800 relative overflow-hidden">
        {item.fileUrl ? (
          <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">📄</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">🔴 Live</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-bold text-white leading-tight">{item.title}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-xs">{item.subject}</Badge>
          <span className="text-xs text-gray-400">by {item.teacherName}</span>
        </div>
        {item.description && <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>}
        {item.rotationDuration && (
          <p className="text-xs text-gray-600">⏱ Rotation: {item.rotationDuration}s</p>
        )}
      </div>
    </div>
  );
}
