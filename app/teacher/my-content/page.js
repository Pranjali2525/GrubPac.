"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ContentCard from "@/components/teacher/ContentCard";
import { Spinner, EmptyState, Select } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/hooks/useData";
import contentService from "@/services/content.service";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function MyContentPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, loading, error, refetch } = useData(
    () => contentService.getTeacherContent(user?.id),
    [user?.id]
  );

  const filtered = useMemo(() => {
    const items = data?.data || [];
    return statusFilter === "all" ? items : items.filter((c) => c.status === statusFilter);
  }, [data, statusFilter]);

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">My Content</h1>
              <p className="text-gray-400 mt-1">All your uploaded content and their statuses.</p>
            </div>
            <Link href="/teacher/upload" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
              + Upload New
            </Link>
          </div>

          {/* Filter */}
          <div className="w-44">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-3">{error}</p>
              <button onClick={refetch} className="text-sm text-indigo-600 hover:underline">Try again</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon="📭" title="No content found" description={statusFilter === "all" ? "Upload your first content to get started." : `No ${statusFilter} content.`} action={<Link href="/teacher/upload" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl font-medium">Upload Now</Link>} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((item) => <ContentCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
