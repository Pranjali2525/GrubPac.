// services/approval.service.js
// All approval workflow API calls.

import { mockDB } from "@/lib/mockData";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const approvalService = {
  /** Get all pending content */
  getPendingContent: async () => {
    await delay(500);
    const items = mockDB.getContent().filter((c) => c.status === "pending");
    return { data: items, total: items.length };
  },

  /** Approve content */
  approveContent: async (contentId) => {
    await delay(700);
    const updated = mockDB.updateContent(contentId, { status: "approved", rejectionReason: null });
    if (!updated) throw new Error("Content not found.");
    return updated;
  },

  /** Reject content with mandatory reason */
  rejectContent: async (contentId, reason) => {
    await delay(700);
    if (!reason?.trim()) throw new Error("Rejection reason is required.");
    const updated = mockDB.updateContent(contentId, {
      status: "rejected",
      rejectionReason: reason.trim(),
    });
    if (!updated) throw new Error("Content not found.");
    return updated;
  },
};

export default approvalService;
