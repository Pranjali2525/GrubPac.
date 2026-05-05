// Mock data for simulating backend responses

export const MOCK_USERS = [
  { id: "t1", email: "teacher@school.com", password: "teacher123", role: "teacher", name: "Sarah Johnson" },
  { id: "t2", email: "teacher2@school.com", password: "teacher123", role: "teacher", name: "Mark Davis" },
  { id: "p1", email: "principal@school.com", password: "principal123", role: "principal", name: "Dr. Emily Carter" },
];

let contentIdCounter = 10;

export const MOCK_CONTENT = [
  {
    id: "c1", teacherId: "t1", teacherName: "Sarah Johnson",
    title: "Introduction to Algebra", subject: "Mathematics",
    description: "Basic algebra concepts for grade 9 students.",
    fileUrl: "https://picsum.photos/seed/algebra/800/600",
    fileType: "image/jpeg", fileName: "algebra.jpg",
    status: "approved", startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    rotationDuration: 30, createdAt: new Date(Date.now() - 86400000).toISOString(),
    rejectionReason: null,
  },
  {
    id: "c2", teacherId: "t1", teacherName: "Sarah Johnson",
    title: "Photosynthesis Process", subject: "Biology",
    description: "How plants convert sunlight into food.",
    fileUrl: "https://picsum.photos/seed/biology/800/600",
    fileType: "image/jpeg", fileName: "photosynthesis.jpg",
    status: "pending", startTime: new Date(Date.now() + 7200000).toISOString(),
    endTime: new Date(Date.now() + 14400000).toISOString(),
    rotationDuration: 20, createdAt: new Date(Date.now() - 43200000).toISOString(),
    rejectionReason: null,
  },
  {
    id: "c3", teacherId: "t1", teacherName: "Sarah Johnson",
    title: "World War II Timeline", subject: "History",
    description: "Key events of World War II.",
    fileUrl: "https://picsum.photos/seed/history/800/600",
    fileType: "image/jpeg", fileName: "ww2.jpg",
    status: "rejected", startTime: new Date(Date.now() - 172800000).toISOString(),
    endTime: new Date(Date.now() - 86400000).toISOString(),
    rotationDuration: 45, createdAt: new Date(Date.now() - 259200000).toISOString(),
    rejectionReason: "Image resolution too low. Please upload a higher quality image.",
  },
  {
    id: "c4", teacherId: "t2", teacherName: "Mark Davis",
    title: "Newton's Laws of Motion", subject: "Physics",
    description: "Understanding the three laws of motion.",
    fileUrl: "https://picsum.photos/seed/physics/800/600",
    fileType: "image/jpeg", fileName: "newton.jpg",
    status: "pending", startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 10800000).toISOString(),
    rotationDuration: 25, createdAt: new Date(Date.now() - 21600000).toISOString(),
    rejectionReason: null,
  },
  {
    id: "c5", teacherId: "t2", teacherName: "Mark Davis",
    title: "Chemical Bonding", subject: "Chemistry",
    description: "Ionic and covalent bonds explained.",
    fileUrl: "https://picsum.photos/seed/chem/800/600",
    fileType: "image/jpeg", fileName: "bonds.jpg",
    status: "approved", startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    rotationDuration: 35, createdAt: new Date(Date.now() - 172800000).toISOString(),
    rejectionReason: null,
  },
];

// Generate more mock data for performance testing
for (let i = 6; i <= 50; i++) {
  const statuses = ["pending", "approved", "rejected"];
  const subjects = ["Mathematics", "Biology", "History", "Physics", "Chemistry", "English", "Geography"];
  const teachers = [
    { id: "t1", name: "Sarah Johnson" },
    { id: "t2", name: "Mark Davis" },
  ];
  const teacher = teachers[i % 2];
  const status = statuses[i % 3];
  MOCK_CONTENT.push({
    id: `c${i}`,
    teacherId: teacher.id,
    teacherName: teacher.name,
    title: `Content Item ${i}`,
    subject: subjects[i % subjects.length],
    description: `Description for content item ${i}.`,
    fileUrl: `https://picsum.photos/seed/content${i}/800/600`,
    fileType: "image/jpeg",
    fileName: `content${i}.jpg`,
    status,
    startTime: new Date(Date.now() - i * 3600000).toISOString(),
    endTime: new Date(Date.now() + i * 3600000).toISOString(),
    rotationDuration: 20 + (i % 40),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    rejectionReason: status === "rejected" ? "Content does not meet guidelines." : null,
  });
}

// In-memory store
let contentStore = [...MOCK_CONTENT];

export const mockDB = {
  getContent: () => [...contentStore],
  getContentById: (id) => contentStore.find((c) => c.id === id),
  getContentByTeacher: (teacherId) => contentStore.filter((c) => c.teacherId === teacherId),
  getActiveContentByTeacher: (teacherId) => {
    const now = new Date();
    return contentStore.filter(
      (c) =>
        c.teacherId === teacherId &&
        c.status === "approved" &&
        new Date(c.startTime) <= now &&
        new Date(c.endTime) >= now
    );
  },
  addContent: (data) => {
    const newItem = { ...data, id: `c${++contentIdCounter}`, createdAt: new Date().toISOString() };
    contentStore = [newItem, ...contentStore];
    return newItem;
  },
  updateContent: (id, updates) => {
    contentStore = contentStore.map((c) => (c.id === id ? { ...c, ...updates } : c));
    return contentStore.find((c) => c.id === id);
  },
  getStats: () => ({
    total: contentStore.length,
    pending: contentStore.filter((c) => c.status === "pending").length,
    approved: contentStore.filter((c) => c.status === "approved").length,
    rejected: contentStore.filter((c) => c.status === "rejected").length,
  }),
  getTeacherStats: (teacherId) => {
    const items = contentStore.filter((c) => c.teacherId === teacherId);
    return {
      total: items.length,
      pending: items.filter((c) => c.status === "pending").length,
      approved: items.filter((c) => c.status === "approved").length,
      rejected: items.filter((c) => c.status === "rejected").length,
    };
  },
};
