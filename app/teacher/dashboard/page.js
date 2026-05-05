"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatsCard, SkeletonCard, EmptyState, Badge } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/hooks/useData";
import contentService from "@/services/content.service";
import { getStatusStyle, formatDateTime } from "@/utils/helpers";
import Link from "next/link";

export default function TeacherDashboard() {
  const { user } = useAuth();

  const { data: stats, loading: statsLoading } = useData(
    () => contentService.getTeacherStats(user?.id),
    [user?.id]
  );

  const { data: contentData, loading: contentLoading } = useData(
    () => contentService.getTeacherContent(user?.id),
    [user?.id]
  );

  const recent = contentData?.data?.slice(0, 5) || [];

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Good day, {user?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-gray-400 mt-1">Here's an overview of your content.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Uploaded" value={stats?.total} icon="📦" color="indigo" loading={statsLoading} />
            <StatsCard title="Pending" value={stats?.pending} icon="⏳" color="amber" loading={statsLoading} />
            <StatsCard title="Approved" value={stats?.approved} icon="✅" color="emerald" loading={statsLoading} />
            <StatsCard title="Rejected" value={stats?.rejected} icon="❌" color="red" loading={statsLoading} />
          </div>

          {/* Quick actions */}
          <div className="flex gap-3">
            <Link href="/teacher/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
              📤 Upload Content
            </Link>
            <Link href="/teacher/my-content" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors">
              📁 View All Content
            </Link>
          </div>

          {/* Recent content */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Content</h2>
              <Link href="/teacher/my-content" className="text-sm text-indigo-600 hover:underline font-medium">View all →</Link>
            </div>

            {contentLoading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)}</div>
            ) : recent.length === 0 ? (
              <EmptyState icon="📭" title="No content yet" description="Upload your first content to get started." action={<Link href="/teacher/upload" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium">Upload Now</Link>} />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recent.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-gray-800 max-w-xs truncate">{item.title}</td>
                        <td className="px-5 py-3.5 text-gray-500">{item.subject}</td>
                        <td className="px-5 py-3.5"><Badge className={getStatusStyle(item.status)}>{item.status}</Badge></td>
                        <td className="px-5 py-3.5 text-gray-400">{formatDateTime(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
