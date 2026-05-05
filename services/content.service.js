// services/content.service.js
// All content-related API calls. Replace mock logic with real httpClient calls
// to connect to a real backend without touching any component.

import { mockDB } from "@/lib/mockData";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const contentService = {
  /** Get all content (principal) */
  getAllContent: async ({ status, search } = {}) => {
    await delay(600);
    let items = mockDB.getContent();
    if (status && status !== "all") items = items.filter((c) => c.status === status);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q)
      );
    }
    return { data: items, total: items.length };
  },

  /** Get content by teacher ID */
  getTeacherContent: async (teacherId) => {
    await delay(500);
    const items = mockDB.getContentByTeacher(teacherId);
    return { data: items };
  },

  /** Get teacher stats */
  getTeacherStats: async (teacherId) => {
    await delay(300);
    return mockDB.getTeacherStats(teacherId);
  },

  /** Get principal stats */
  getPrincipalStats: async () => {
    await delay(300);
    return mockDB.getStats();
  },

  /** Get single content */
  getContentById: async (id) => {
    await delay(300);
    const item = mockDB.getContentById(id);
    if (!item) throw new Error("Content not found.");
    return item;
  },

  /** Upload new content */
  uploadContent: async (formData) => {
    await delay(1200); // simulate upload
    const fileUrl = formData.get("filePreviewUrl") || "https://picsum.photos/seed/new/800/600";
    const newItem = mockDB.addContent({
      teacherId: formData.get("teacherId"),
      teacherName: formData.get("teacherName"),
      title: formData.get("title"),
      subject: formData.get("subject"),
      description: formData.get("description") || "",
      fileUrl,
      fileType: formData.get("fileType") || "image/jpeg",
      fileName: formData.get("fileName") || "upload.jpg",
      status: "pending",
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      rotationDuration: Number(formData.get("rotationDuration")) || 30,
      rejectionReason: null,
    });
    return newItem;
  },

  /** Get active content for public live page */
  getLiveContent: async (teacherId) => {
    await delay(500);
    const items = mockDB.getActiveContentByTeacher(teacherId);
    return { data: items };
  },
};

export default contentService;
