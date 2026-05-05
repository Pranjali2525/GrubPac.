"use client";
import { useState, useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Spinner, EmptyState, Badge, Select, Input } from "@/components/ui";
import { useData } from "@/hooks/useData";
import contentService from "@/services/content.service";
import { getStatusStyle, formatDateTime } from "@/utils/helpers";

export default function AllContentPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useData(() => contentService.getAllContent());

  const filtered = useMemo(() => {
    let items = data?.data || [];
    if (statusFilter !== "all") items = items.filter((c) => c.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
      );
    }
    return items;
  }, [data, statusFilter, search]);

  return (
    <ProtectedRoute allowedRoles={["principal"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">All Content</h1>
            <p className="text-gray-400 mt-1">Browse and filter all content across the school.</p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="w-44">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
            <div className="w-64">
              <Input placeholder="Search title, subject, teacher…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center text-sm text-gray-400 font-medium">
              {!loading && `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-3">{error}</p>
              <button onClick={refetch} className="text-sm text-indigo-600 hover:underline">Try again</button>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon="🔍" title="No results found" description="Try adjusting your filters or search query." />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Teacher</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Schedule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.fileUrl && <img src={item.fileUrl} alt="" className="w-full h-full object-cover" />}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-800 max-w-xs">
                          <p className="truncate">{item.title}</p>
                          {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                        </td>
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{item.teacherName}</td>
                        <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{item.subject}</td>
                        <td className="px-5 py-3 whitespace-nowrap">
                          <Badge className={getStatusStyle(item.status)}>{item.status}</Badge>
                          {item.status === "rejected" && item.rejectionReason && (
                            <p className="text-xs text-red-400 mt-1 max-w-32 truncate" title={item.rejectionReason}>{item.rejectionReason}</p>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400 whitespace-nowrap">
                          <p>{formatDateTime(item.startTime)}</p>
                          <p>→ {formatDateTime(item.endTime)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
