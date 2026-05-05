"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button, Modal, Textarea, Spinner, EmptyState, Badge, Card } from "@/components/ui";
import { useData } from "@/hooks/useData";
import approvalService from "@/services/approval.service";
import { formatDateTime } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function ApprovalsPage() {
  const { data, loading, error, refetch } = useData(() => approvalService.getPendingContent());
  const [selected, setSelected] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const handleApprove = async (item) => {
    setActionLoading(item.id);
    try {
      await approvalService.approveContent(item.id);
      toast.success(`"${item.title}" approved!`);
      refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to approve.");
    } finally {
      setActionLoading(null);
    }
  };

  const openReject = (item) => {
    setSelected(item); setReason(""); setReasonError(""); setRejectModal(true);
  };

  const handleReject = async () => {
    if (!reason.trim()) { setReasonError("Rejection reason is required."); return; }
    setActionLoading(selected.id);
    try {
      await approvalService.rejectContent(selected.id, reason);
      toast.success(`"${selected.title}" rejected.`);
      setRejectModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.message || "Failed to reject.");
    } finally {
      setActionLoading(null);
    }
  };

  const items = data?.data || [];

  return (
    <ProtectedRoute allowedRoles={["principal"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-400 mt-1">Review and approve or reject submitted content.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <EmptyState icon="🎉" title="All caught up!" description="No content is waiting for approval." />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {items.map((item) => (
                <Card key={item.id} className="p-5">
                  <div className="flex gap-4">
                    {/* Preview thumb */}
                    <div
                      className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => { setSelected(item); setPreviewModal(true); }}>
                      {item.fileUrl ? (
                        <img src={item.fileUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">📄</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{item.title}</h3>
                      <p className="text-xs text-gray-400">{item.teacherName} · {item.subject}</p>
                      {item.description && <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>}
                      <div className="text-xs text-gray-400">
                        <span>{formatDateTime(item.startTime)} → {formatDateTime(item.endTime)}</span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button size="sm" variant="success" loading={actionLoading === item.id} onClick={() => handleApprove(item)}>✓ Approve</Button>
                        <Button size="sm" variant="danger" disabled={!!actionLoading} onClick={() => openReject(item)}>✕ Reject</Button>
                        <Button size="sm" variant="ghost" onClick={() => { setSelected(item); setPreviewModal(true); }}>Preview</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reject Modal */}
        <Modal open={rejectModal} onClose={() => setRejectModal(false)} title="Reject Content">
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700">{selected?.title}</p>
              <p className="text-xs text-gray-400">{selected?.teacherName}</p>
            </div>
            <Textarea
              label="Rejection Reason"
              placeholder="Please provide a clear reason for rejection..."
              value={reason}
              onChange={(e) => { setReason(e.target.value); setReasonError(""); }}
              error={reasonError}
              required
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="danger" loading={!!actionLoading} onClick={handleReject} className="flex-1">Confirm Reject</Button>
              <Button variant="secondary" onClick={() => setRejectModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal>

        {/* Preview Modal */}
        <Modal open={previewModal} onClose={() => setPreviewModal(false)} title={selected?.title} className="max-w-2xl">
          {selected && (
            <div className="space-y-4">
              <img src={selected.fileUrl} alt={selected.title} className="w-full rounded-xl object-cover max-h-72" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">Subject:</span> <span className="font-medium text-gray-700">{selected.subject}</span></div>
                <div><span className="text-gray-400">Teacher:</span> <span className="font-medium text-gray-700">{selected.teacherName}</span></div>
                <div><span className="text-gray-400">Start:</span> <span className="font-medium text-gray-700">{formatDateTime(selected.startTime)}</span></div>
                <div><span className="text-gray-400">End:</span> <span className="font-medium text-gray-700">{formatDateTime(selected.endTime)}</span></div>
              </div>
              {selected.description && <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{selected.description}</p>}
              <div className="flex gap-3">
                <Button variant="success" onClick={() => { handleApprove(selected); setPreviewModal(false); }} className="flex-1">✓ Approve</Button>
                <Button variant="danger" onClick={() => { setPreviewModal(false); openReject(selected); }}>✕ Reject</Button>
              </div>
            </div>
          )}
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
